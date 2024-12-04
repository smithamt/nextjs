import React, { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
  mainTitle: string;
  description: string;
  contentTitle: string;
  headerContext?: React.ReactNode;
}

const PayrollDashboardCardLayout: FC<LayoutProps> = ({
  children,
  mainTitle,
  description,
  contentTitle,
  headerContext,
}) => {
  return (
    <div className="p-4">
      <div className="flex justify-between">
        <div>
          <p className="font-bold text-lg">{mainTitle}</p>
          <p className="text-xs inactive-text my-2">{description}</p>
        </div>
        {headerContext}
      </div>
      <div className="rounded-md w-full min-h-[313px] cart-bg p-2">
        <p className="font-semibold p-2">{contentTitle}</p>
        {children}
      </div>
    </div>
  );
};

export default PayrollDashboardCardLayout;
