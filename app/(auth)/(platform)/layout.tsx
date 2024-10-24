import EarningsTranscriptSheet from "./earnings/components/EarningsSheet";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen">
      <div className="w-2/3">{children}</div>
      <div className="w-1/3 border-l border-gray-200">
        <EarningsTranscriptSheet />
      </div>
    </main>
  );
};

export default PlatformLayout;
