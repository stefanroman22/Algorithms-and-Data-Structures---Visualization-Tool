import React from "react";

type NoteProps = {
  children: React.ReactNode;
  fontSize?: string;
};

function Note({ children, fontSize = "14px" }: NoteProps) {
  return (
    <small style={{ fontSize }}>
      <strong>Note:</strong> {children}
    </small>
  );
}

export default Note;
