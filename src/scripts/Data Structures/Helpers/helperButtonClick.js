// 📌 scripts/helpers/handleButtonClick.ts
export const handleButtonClick = (
    isDisabled,
    setIsDisabled,
    action
  ) => {
    if (isDisabled) return;
    setIsDisabled(true);
    action(); // Execute the action
    setTimeout(() => setIsDisabled(false), 800); // Re-enable after 800ms
  };
  