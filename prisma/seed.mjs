import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

process.loadenv?.();

const prisma = new PrismaClient();

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function main() {
  const email = (process.env.SEED_USER_EMAIL || "dev@invoice.local").toLowerCase();
  const password = process.env.SEED_USER_PASSWORD;

  if (!password) {
    console.error(
      "Refusing to seed: set SEED_USER_PASSWORD (and optionally SEED_USER_EMAIL)\n" +
        "in your local .env first. Never commit this value to git."
    );
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("SEED_USER_PASSWORD must be at least 8 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { name: "Dev User", email, passwordHash },
  });

  await prisma.invoice.deleteMany({ where: { userId: user.id } });

  const invoices = [
    {
      clientName: "Acme Digital",
      clientEmail: "acme@example.com",
      invoiceAmount: 15000,
      dueDate: daysFromNow(7),
      status: "UNPAID",
      lastFollowUp: null,
      notes: "PO received; payment expected on the due date.",
    },
    {
      clientName: "XYZ Agency",
      clientEmail: "xyz@example.com",
      invoiceAmount: 8500,
      dueDate: daysFromNow(10),
      status: "UNPAID",
      lastFollowUp: null,
      notes: "Net-15 terms agreed over email.",
    },
    {
      clientName: "TechStart Inc",
      clientEmail: "techstart@example.com",
      invoiceAmount: 22000,
      dueDate: daysFromNow(-14),
      status: "OVERDUE",
      lastFollowUp: daysFromNow(-2),
      notes: "Second reminder sent; client promised payout this week.",
    },
    {
      clientName: "Freelance Client",
      clientEmail: "freelance@example.com",
      invoiceAmount: 5000,
      dueDate: daysFromNow(5),
      status: "UNPAID",
      lastFollowUp: null,
      notes: "Milestone 1 of 3.",
    },
    {
      clientName: "Marketing Studio",
      clientEmail: "marketing@example.com",
      invoiceAmount: 12000,
      dueDate: daysFromNow(12),
      status: "UNPAID",
      lastFollowUp: null,
      notes: "Forwarded to accounts payable.",
    },
    {
      clientName: "Design Co",
      clientEmail: "design@example.com",
      invoiceAmount: 18500,
      dueDate: daysFromNow(-3),
      status: "PARTIAL",
      lastFollowUp: daysFromNow(-5),
      notes: "50% advance received; balance of Rs 9,250 pending.",
    },
    {
      clientName: "Past Client",
      clientEmail: "pastclient@example.com",
      invoiceAmount: 10000,
      dueDate: daysFromNow(-30),
      status: "PAID",
      lastFollowUp: null,
      notes: "Paid in full via NEFT bank transfer.",
    },
    {
      clientName: "New Startup",
      clientEmail: "startup@example.com",
      invoiceAmount: 7500,
      dueDate: daysFromNow(14),
      status: "UNPAID",
      lastFollowUp: null,
      notes: "New client; confirm GST details before filing.",
    },
  ];

  const result = await prisma.invoice.createMany({
    data: invoices.map((invoice) => ({ ...invoice, userId: user.id })),
  });

  console.log(`Seeded ${result.count} invoices for ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

