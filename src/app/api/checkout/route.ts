
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const catalog = {
  p1: { name: "Fresh Red Apples", price: 420, stock: 35 },
  p2: { name: "Organic Bananas", price: 230, stock: 42 },
  p3: { name: "Farm Fresh Tomatoes", price: 160, stock: 28 },
  p4: { name: "Green Avocados", price: 390, stock: 12 },
  p5: { name: "Farm Fresh Milk", price: 250, stock: 50 },
  p6: { name: "Free Range Eggs", price: 360, stock: 30 },
  p7: { name: "Premium Basmati Rice", price: 390, stock: 65 },
  p8: { name: "Red Lentils (Masoor)", price: 285, stock: 48 },
  p9: { name: "Extra Virgin Olive Oil", price: 1150, stock: 18 },
  p10: { name: "Ground Turmeric", price: 120, stock: 70 },
  p11: { name: "Orange Juice", price: 310, stock: 24 },
  p12: { name: "Potato Crisps", price: 180, stock: 36 },
  p13: { name: "Dishwashing Liquid", price: 280, stock: 20 },
  p14: { name: "Laundry Detergent", price: 520, stock: 15 },
  p15: { name: "Fresh Spinach", price: 90, stock: 17 },
  p16: { name: "Whole Wheat Flour", price: 790, stock: 40 },
};

export async function POST(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secret = process.env.SUPABASE_SECRET_KEY;

    if (!url || !secret) {
      return NextResponse.json(
        { error: "Server database settings are missing." },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { customerName, phone, address, city, notes, items } = body;

    if (
      typeof customerName !== "string" ||
      customerName.trim().length < 2 ||
      typeof phone !== "string" ||
      phone.trim().length < 7 ||
      typeof address !== "string" ||
      address.trim().length < 5 ||
      typeof city !== "string" ||
      city.trim().length < 2 ||
      !Array.isArray(items) ||
      items.length < 1 ||
      items.length > 30
    ) {
      return NextResponse.json(
        { error: "Please provide valid delivery details and basket items." },
        { status: 400 },
      );
    }

    const safeItems: {
      productId: keyof typeof catalog;
      name: string;
      price: number;
      quantity: number;
    }[] = [];

    for (const item of items) {
      if (
        !item ||
        typeof item.productId !== "string" ||
        !Object.prototype.hasOwnProperty.call(catalog, item.productId) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return NextResponse.json(
          { error: "The basket contains an invalid item." },
          { status: 400 },
        );
      }

      const productId = item.productId as keyof typeof catalog;
      const product = catalog[productId];

      if (item.quantity > product.stock) {
        return NextResponse.json(
          { error: `${product.name} has insufficient stock.` },
          { status: 400 },
        );
      }

      safeItems.push({
        productId,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    const subtotal = safeItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const supabase = createClient(url, secret, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        notes:
          typeof notes === "string" ? notes.trim().slice(0, 500) : null,
        subtotal,
        delivery_fee: 0,
        total: subtotal,
        payment_method: "cod",
        payment_status: "unpaid",
        order_status: "placed",
      })
      .select("id, order_number")
      .single();

    if (orderError || !order) {
  console.error("Order insert failed:", orderError);

  return NextResponse.json(
    {
      error: orderError?.message || "Could not save the order.",
    },
    { status: 500 },
  );
}
      return NextResponse.json(
        { error: "Could not save the order. Please try again." },
        { status: 500 },
      );
    }

    const orderItems = safeItems.map((item) => ({
      order_id: order.id,
      // Current storefront product IDs (p1, p2, ...) are not UUIDs.
      // Product names and prices are verified on the server above.
      product_id: null,
      product_name: item.name,
      unit_price: item.price,
      quantity: item.quantity,
      line_total: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order items insert failed:", itemsError.message);
      await supabase.from("orders").delete().eq("id", order.id);

      return NextResponse.json(
        { error: "Could not save the order items. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, orderNumber: order.order_number },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request. Please check your details and try again." },
      { status: 400 },
    );
  }
}
