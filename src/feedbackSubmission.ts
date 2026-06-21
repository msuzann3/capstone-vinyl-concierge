export interface FeedbackPayload {
  submittedAt: string;
  source: "vinyl-concierge-week-5-feedback";
  respondent: {
    name: string;
    email: string;
    musicBuyerType: string;
  };
  priorExperience: {
    usedSimilarBefore: string;
    similarToolsUsed: string;
    likedBefore: string;
    frustratingBefore: string;
  };
  usability: {
    firstStepClarity: string;
    confusingMoment: string;
    recommendationClarity: string;
    uiEase: string;
    uiFriction: string;
    notColors: string;
  };
  recommendationQuality: {
    feltConnected: string;
    notesHelpful: string;
    trustSignal: string;
    wantedToExplore: string;
    expectedBetterUnderstanding: string;
  };
  decisionSignals: {
    mostUsefulChange: string;
    wouldUseAtStore: string;
    guidedVsAllAtOnce: string;
    finalComment: string;
  };
  metadata: {
    pageUrl: string;
    userAgent: string;
  };
}

const configuredWebhookUrl = import.meta.env.VITE_N8N_FEEDBACK_WEBHOOK_URL as string | undefined;

export function hasFeedbackWebhook() {
  return Boolean(configuredWebhookUrl && !configuredWebhookUrl.includes("your-n8n-domain"));
}

export async function submitFeedbackToWebhook(payload: FeedbackPayload) {
  if (!hasFeedbackWebhook() || !configuredWebhookUrl) {
    throw new Error("No n8n webhook is configured yet.");
  }

  const response = await fetch(configuredWebhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`The feedback webhook returned ${response.status}.`);
  }
}
