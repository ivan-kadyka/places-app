import { NextResponse } from "next/server";

const graphqlEndpoint =
  process.env.BACKEND_GRAPHQL_ENDPOINT ?? "http://localhost:8000/graphql";

export async function POST(request: Request) {
  const body = await request.text();

  const response = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body,
  });

  const payload = await response.text();

  return new NextResponse(payload, {
    status: response.status,
    headers: {
      "content-type":
        response.headers.get("content-type") ?? "application/json",
    },
  });
}
