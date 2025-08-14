import { Welcome } from "../welcome/welcome";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function meta() {
  return [
    { title: "Cantina - Modern Mexican Restaurant" },
    { name: "description", content: "Order, reserve, and enjoy authentic cuisine" },
  ];
}

export default function Home() {
  return (
    <section className="container mx-auto p-6 grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Cantina</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-muted-foreground">Experience a modern, fast, and beautiful ordering experience.</p>
          <div className="flex gap-3">
            <Button>Order Now</Button>
            <Button variant="secondary">View Menu</Button>
          </div>
        </CardContent>
      </Card>
      <Welcome />
    </section>
  );
}
