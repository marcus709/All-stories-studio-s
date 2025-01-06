interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="p-4 text-center">
      <p className="text-red-500">{message}</p>
    </div>
  );
};