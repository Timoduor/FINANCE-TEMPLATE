import { db } from "@vercel/postgres";

const client = await db.connect();

async function listInvoices() {
  const data = await client.sql`
     SELECT invoices.amount, customers.name
     FROM invoices
     JOIN customers ON invoices.customer_id = customers.id
     WHERE invoices.amount = 666;
   `;

  return data.rows;
}

export async function GET() {
  try {
    const invoices = await listInvoices();
    return Response.json(invoices);
  } catch (error) {
    console.error('Error listing invoices:', error);
    return Response.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  } finally {
    await client.end(); // Ensure the database connection is closed
  }
}
