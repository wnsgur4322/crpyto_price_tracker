import React from "react";
import Layout from "@theme/Layout";
import useBaseUrl from "@docusaurus/useBaseUrl";
import MDXContent from "@theme/MDXContent";

// Import the Markdown file
import IntroContent from "../../docs/intro.md";

export default function Home() {
  return (
    <Layout title="Welcome to Crypto Tracker" description="Crypto Tracker Docs">
      <main className="container">
        <h1 style={{textAlign: "center"}}>Welcome to Crypto Price Tracker Docs</h1>
        <MDXContent>
          <IntroContent />
        </MDXContent>
      </main>
    </Layout>
  );
}
