"use client";

import React from "react";
import TextComponent from "./text-component";

export default function ParagraphComponent(props: any) {
  return (
    <TextComponent
      {...props}
      fontSize={props.fontSize || 14}
      lineHeight={props.lineHeight || 1.6}
    />
  );
}
