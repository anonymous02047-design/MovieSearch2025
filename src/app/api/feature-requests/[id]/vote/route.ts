import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import FeatureRequest from '@/models/FeatureRequest';
import { handleApiError, createError } from '@/utils/enhancedErrorHandling';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      throw createError.unauthorized('You must be signed in to vote');
    }

    await connectDB();

    const featureRequest = await FeatureRequest.findById(params.id);

    if (!featureRequest) {
      throw createError.notFound('Feature request not found');
    }

    // Check if user already voted
    const alreadyVoted = featureRequest.votedBy.includes(userId);

    if (alreadyVoted) {
      // Remove vote
      featureRequest.votes = Math.max(0, featureRequest.votes - 1);
      featureRequest.votedBy = featureRequest.votedBy.filter((id: string) => id !== userId);
    } else {
      // Add vote
      featureRequest.votes += 1;
      featureRequest.votedBy.push(userId);
    }

    await featureRequest.save();

    return NextResponse.json({
      success: true,
      voted: !alreadyVoted,
      votes: featureRequest.votes,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

