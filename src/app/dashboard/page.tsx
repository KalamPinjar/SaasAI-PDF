import DashboardPage from "@/components/Dashboard";
import { db } from "@/db";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

const Dashboard = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) {
    redirect("/auth-callback?origin=dashboard");
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    redirect("/auth-callback?origin=dashboard");
  }

  const subsciptionPlan = await getUserSubscriptionPlan();

  return (
    <>
      <DashboardPage subsciptionPlan={subsciptionPlan} />
    </>
  );
};

export default Dashboard;
