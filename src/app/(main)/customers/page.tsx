import { getAllCustomers } from "../dashboard/actions"
import CustomersClient from "./CustomersClient"

import { redirect } from "next/navigation"

export default async function CustomersPage() {
  let customers;
  try {
    customers = await getAllCustomers()
  } catch (err) {
    redirect("/login")
  }

  return <CustomersClient customers={customers} />
}
