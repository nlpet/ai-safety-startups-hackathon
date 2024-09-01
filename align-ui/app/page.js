"use client";

import React, { useState, useEffect } from "react";
import ld from "lodash";

import Container from "@/components/ui/container";

import MultiAgentCollaboration from "@/components/MultiAgentCollaboration";

export default function Home() {
  return (
    <Container>
      <div className="text-center">
        {/* <h1 className="text-5xl mt-20">Multi-Agent Collaboration Platform</h1> */}
        <hr className="mt-3 w-4/6 mx-auto border-y-1 border-1 border-dashed" />
      </div>
      <div className="flex w-3/4 mx-auto justify-center items-center mt-10"></div>

      <MultiAgentCollaboration />
    </Container>
  );
}
