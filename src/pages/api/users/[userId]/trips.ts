import axios from "axios";
import { CreateTripRequest, Trip, User } from "common/types";
import type { NextApiRequest, NextApiResponse } from "next";
import { CreateTripEndpoint, GetTripsEndpoint } from "common/utilities";

const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL || "http://localhost:8080",
});

type GetTripResponse = Trip[];
type CreateTripResonse = User;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const userId = req.query["userId"] as string;

    client
      .get<GetTripResponse>(GetTripsEndpoint(userId))
      .then((result) => {
        res.status(200).json(result.data);
      })
      .catch((error) => {
        res.status(400).json(error.response.data);
      });
  }

  if (req.method === "POST") {
    const userId = req.query["userId"] as string;
    const request = req.body as CreateTripRequest;

    if (!request) {
      res.status(400).json("Missing required query parameters.");
      return;
    }

    client
      .post<CreateTripResonse>(CreateTripEndpoint(userId), request)
      .then((result) => {
        res.status(200).json(result.data);
      })
      .catch((error) => {
        res.status(400).json(error.response.data);
      });
  }
}
