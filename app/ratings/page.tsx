import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"
import { RatingsChart } from "@/components/dashboard/ratings-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

const recentReviews = [
  {
    id: 1,
    customer: "Abdullah",
    flavor: "Chocolate",
    rating: 5,
    comment: "Absolutely delicious! Best chocolate ice cream I've ever had.",
    date: "2026-03-09",
  },
  {
    id: 2,
    customer: "Sherry",
    flavor: "Vanilla",
    rating: 4,
    comment: "Smooth and creamy. Classic taste.",
    date: "2026-03-09",
  },
  {
    id: 3,
    customer: "Ahmed",
    flavor: "Strawberry",
    rating: 5,
    comment: "Fresh strawberry flavor, not artificial at all!",
    date: "2026-03-08",
  },
  {
    id: 4,
    customer: "Ali",
    flavor: "Mint Chip",
    rating: 4,
    comment: "Refreshing mint with perfect chocolate chips ratio.",
    date: "2026-03-08",
  },
  {
    id: 5,
    customer: "Hamza",
    flavor: "Cookie Dough",
    rating: 5,
    comment: "The cookie dough chunks are amazing!",
    date: "2026-03-07",
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? "fill-[oklch(0.88_0.18_90)] text-[oklch(0.88_0.18_90)]" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  )
}

export default function RatingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:pl-64">
        <Header />
        <main className="p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-black rb-text">⭐ Ratings</h1>
            <p className="text-sm text-muted-foreground">
              Customer reviews and ratings overview
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <RatingsChart />

            <Card className="border-0 bg-card rb-card overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-bold rb-text">💬 Recent Reviews</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Latest customer feedback
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentReviews.map((review, i) => {
                  const borders = [
                    "from-[oklch(0.68_0.28_25)] to-[oklch(0.78_0.22_55)]",
                    "from-[oklch(0.78_0.22_55)] to-[oklch(0.88_0.18_90)]",
                    "from-[oklch(0.72_0.22_145)] to-[oklch(0.65_0.22_230)]",
                    "from-[oklch(0.65_0.22_230)] to-[oklch(0.68_0.26_310)]",
                    "from-[oklch(0.68_0.26_310)] to-[oklch(0.72_0.28_350)]",
                  ]
                  return (
                  <div
                    key={review.id}
                    className={`rounded-xl bg-gradient-to-br ${borders[i % borders.length]} p-[2px]`}
                  >
                  <div className="rounded-[calc(var(--radius)-2px)] bg-secondary/80 backdrop-blur-sm p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="font-medium text-card-foreground">
                          {review.customer}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {review.flavor} • {review.date}
                        </p>
                      </div>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="text-sm text-muted-foreground">{review.comment}</p>
                  </div>
                  </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
