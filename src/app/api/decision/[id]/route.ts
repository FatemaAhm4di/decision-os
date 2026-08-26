import { NextResponse } from "next/server";

import { deleteDecision } from "@/lib/decision/delete-decision";
import { getDecision } from "@/lib/decision/get-decision";
import {
  updateDecision,
  type UpdateDecisionInput,
} from "@/lib/decision/update-decision";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          message: "Decision ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const decision = await getDecision(id);

    if (!decision) {
      return NextResponse.json(
        {
          message: "Decision not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(decision);
  } catch (error) {
    console.error(
      "Failed to fetch decision:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to fetch decision",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          message: "Decision ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const body =
      (await request.json()) as UpdateDecisionInput;

    const decision = await updateDecision(
      id,
      body
    );

    return NextResponse.json(decision);
  } catch (error) {
    console.error(
      "Failed to update decision:",
      error
    );

    if (
      error instanceof Error &&
      error.message === "Decision not found"
    ) {
      return NextResponse.json(
        {
          message: "Decision not found",
        },
        {
          status: 404,
        }
      );
    }

    if (
      error instanceof Error &&
      error.message === "Decision title is required"
    ) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to update decision",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          message: "Decision ID is required",
        },
        {
          status: 400,
        }
      );
    }

    const deletedDecision =
      await deleteDecision(id);

    if (!deletedDecision) {
      return NextResponse.json(
        {
          message: "Decision not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      message: "Decision deleted successfully",
    });
  } catch (error) {
    console.error(
      "Failed to delete decision:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to delete decision",
      },
      {
        status: 500,
      }
    );
  }
}