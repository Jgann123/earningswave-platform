"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/authDialog";
import { useEmailModal } from "@/store/EmailModalStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "@clerk/nextjs";
import { pricingPlans } from "@/app/data";
import PricingCard from "../PricingCard";
import { useApiClient } from "@/lib/apiClient";

export function SubscriptionModal() {
  const emailModal = useEmailModal();
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  const { user } = useUser();

  useEffect(() => {
    setStripePromise(loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!));
  }, []);

  const togglePricingPeriod = (value: string) => {
    setIsYearly(value === "annual");
  };

  const handleCheckout = async (priceId: string, subscription: boolean) => {
    console.log("user", user?.id);
    console.log("email", user?.emailAddresses[0].emailAddress);
    console.log("priceId", priceId);
    console.log("subscription", subscription);

    const apiClient = useApiClient();

    try {
      const { data } = await apiClient.post(
        "/payments/create-checkout-session",
        {
          userId: user?.id,
          email: user?.emailAddresses[0].emailAddress,
          priceId,
          subscription,
        }
      );
      console.log(data);

      if (data.sessionId) {
        const stripe = await stripePromise;
        console.log(stripe);

        const response = await stripe?.redirectToCheckout({
          sessionId: data.sessionId,
        });
        console.log(response);

        return response;
      } else {
        console.error("No sessionId found");
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  return (
    <Dialog open={emailModal.isOpen} onOpenChange={emailModal.onClose}>
      <DialogContent className="sm:max-w-[800px] bg-white rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Choose Your EarningsWave Plan
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2">
            Select the plan that best fits your needs.
          </DialogDescription>
        </DialogHeader>
        <Tabs
          defaultValue="monthly"
          className="w-full"
          onValueChange={togglePricingPeriod}
        >
          <div className="flex justify-center mb-6">
            <TabsList className="inline-flex h-10 items-center justify-center rounded-full bg-gray-100 p-1 text-gray-600">
              <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
              <TabsTrigger value="annual">Annual Billing</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="monthly">
            <PricingCards isAnnual={false} />
          </TabsContent>
          <TabsContent value="annual">
            <PricingCards isAnnual={true} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );

  function PricingCards({ isAnnual }: { isAnnual: boolean }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pricingPlans.map((plan, index) => (
          <PricingCard
            key={plan.name}
            plan={plan}
            isAnnual={isAnnual}
            index={index}
            handleCheckout={handleCheckout}
            user={user}
            isYearly={isYearly}
          />
        ))}
      </div>
    );
  }
}
