import { pakistaniCustomers } from "@/lib/data/customers"

export type CustomerStatus = "VIP" | "Active" | "New" | "Inactive"

export interface OrderCustomerRecord {
  customer_email: string
  customer_name?: string | null
  total?: number | null
  created_at?: string | null
}

export interface CustomerSummary {
  email: string
  name: string
  orders: number
  spent: number
  status: CustomerStatus
  joined: string
}

const MIN_ORDERS = 1
const MAX_ORDERS = 10
const MIN_SPENT = 200
const MAX_SPENT = 2500

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function hashSeed(seed: string) {
  let hash = 0

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0
  }

  return hash
}

function getFallbackMetrics(seed: string) {
  const hash = hashSeed(seed)
  const orders = MIN_ORDERS + (hash % (MAX_ORDERS - MIN_ORDERS + 1))
  const avgOrderValue = 180 + (Math.floor(hash / 17) % 121)
  const spent = clamp(orders * avgOrderValue, MIN_SPENT, MAX_SPENT)

  return { orders, spent }
}

function normalizeMetrics(rawOrders: number, rawSpent: number, seed: string) {
  const fallback = getFallbackMetrics(seed)

  return {
    orders: rawOrders > 0 ? clamp(Math.round(rawOrders), MIN_ORDERS, MAX_ORDERS) : fallback.orders,
    spent: rawSpent > 0 ? clamp(Math.round(rawSpent), MIN_SPENT, MAX_SPENT) : fallback.spent,
  }
}

function getCustomerStatus(orders: number): CustomerStatus {
  if (orders >= 8) return "VIP"
  if (orders >= 3) return "Active"
  if (orders >= 1) return "New"
  return "Inactive"
}

function getFallbackJoinedDate(seed: string) {
  const hash = hashSeed(seed)
  const date = new Date()
  date.setDate(date.getDate() - (hash % 180))
  return date.toISOString().split("T")[0]
}

export function buildCustomerSummaries(orders: OrderCustomerRecord[] | null | undefined) {
  const customerMap: Record<
    string,
    {
      email: string
      name: string
      orders: number
      total: number
      firstOrder: string
    }
  > = {}

  if (orders && orders.length > 0) {
    orders.forEach((order) => {
      const email = order.customer_email

      if (!email) return

      if (!customerMap[email]) {
        customerMap[email] = {
          email,
          name: order.customer_name || "Unknown",
          orders: 0,
          total: 0,
          firstOrder: order.created_at || new Date().toISOString(),
        }
      }

      customerMap[email].orders += 1
      customerMap[email].total += order.total || 0

      if (
        order.created_at &&
        new Date(order.created_at).getTime() < new Date(customerMap[email].firstOrder).getTime()
      ) {
        customerMap[email].firstOrder = order.created_at
      }
    })
  }

  const summaries =
    Object.keys(customerMap).length > 0
      ? Object.values(customerMap).map((customer) => {
          const mappedCustomer = pakistaniCustomers.find((entry) => entry.email === customer.email)
          const metrics = normalizeMetrics(customer.orders, customer.total, customer.email)

          return {
            email: customer.email,
            name: mappedCustomer?.name || customer.name,
            orders: metrics.orders,
            spent: metrics.spent,
            status: getCustomerStatus(metrics.orders),
            joined: new Date(customer.firstOrder).toISOString().split("T")[0],
          }
        })
      : pakistaniCustomers.map((customer) => {
          const metrics = getFallbackMetrics(customer.email)

          return {
            email: customer.email,
            name: customer.name,
            orders: metrics.orders,
            spent: metrics.spent,
            status: getCustomerStatus(metrics.orders),
            joined: getFallbackJoinedDate(customer.email),
          }
        })

  return summaries.sort((left, right) => {
    if (right.orders !== left.orders) {
      return right.orders - left.orders
    }

    return right.spent - left.spent
  })
}

export function getCustomerOverviewStats(customers: CustomerSummary[]) {
  const count = customers.length

  if (count === 0) {
    return {
      totalCustomers: 0,
      averageOrders: 0,
      averageSpent: 0,
      vipCustomers: 0,
    }
  }

  return {
    totalCustomers: count,
    averageOrders: Math.round(customers.reduce((sum, customer) => sum + customer.orders, 0) / count),
    averageSpent: Math.round(customers.reduce((sum, customer) => sum + customer.spent, 0) / count),
    vipCustomers: customers.filter((customer) => customer.status === "VIP").length,
  }
}
