
import SuccessfulComponent from "@/components/Successfull";

export default function Successful() {
  return (
    <SuccessfulComponent
      title="Successful!"
      message="Congratulations! Your password has been successfully updated."
      hasButton={false} // Show button
    />
  );
}