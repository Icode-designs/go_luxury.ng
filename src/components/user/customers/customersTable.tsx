"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { IoIosSearch } from "react-icons/io";
import type { AdminCustomerRow } from "@/lib/customers/getCustomersForAdmin";
import { AdminHeaderInputBox } from "../user.styles";
import { ToolbarWrap, TableWrap, GuestPill, EmptyStateBox } from "./customers.styles";

interface CustomersTableProps {
  initialCustomers: AdminCustomerRow[];
}

const CustomersTable = ({ initialCustomers }: CustomersTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term.length === 0) return initialCustomers;
    return initialCustomers.filter(
      (c) =>
        (c.fullName?.toLowerCase().includes(term) ?? false) ||
        c.email.toLowerCase().includes(term) ||
        (c.phone?.toLowerCase().includes(term) ?? false),
    );
  }, [initialCustomers, searchTerm]);

  return (
    <div>
      <ToolbarWrap>
        <AdminHeaderInputBox>
          <div>
            <input
              type="text"
              placeholder="Search by name, email, or phone…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <IoIosSearch />
          </div>
        </AdminHeaderInputBox>
      </ToolbarWrap>

      {filtered.length === 0 ? (
        <TableWrap>
          <EmptyStateBox>
            {initialCustomers.length === 0
              ? "No customers yet."
              : "No customers match your search."}
          </EmptyStateBox>
        </TableWrap>
      ) : (
        <TableWrap>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Total order value</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <Link href={`/admin/customers/${customer.id}`}>
                      {customer.fullName ?? "—"}
                    </Link>{" "}
                    {customer.isGuest && <GuestPill>Guest</GuestPill>}
                  </td>
                  <td>{customer.email}</td>
                  <td>{customer.phone ?? "—"}</td>
                  <td>{customer.orderCount}</td>
                  <td>₦{customer.totalOrderValue.toLocaleString()}</td>
                  <td>
                    {new Date(customer.createdAt).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableWrap>
      )}
    </div>
  );
};

export default CustomersTable;
