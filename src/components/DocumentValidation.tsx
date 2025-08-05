import { AlertTriangle, CheckCircle } from "lucide-react";
import { validateDocument } from "@/utils/contactInfo";

interface DocumentValidationProps {
  documentType: string;
  documentNumber: string;
}

export const DocumentValidation = ({ documentType, documentNumber }: DocumentValidationProps) => {
  if (!documentNumber) return null;

  const isValid = validateDocument(documentType, documentNumber);

  const getValidationMessage = () => {
    switch (documentType) {
      case 'passport':
        return isValid 
          ? "Formato de passaporte válido" 
          : "Formato inválido. Use apenas letras e números (6-9 caracteres)";
      case 'nie':
        return isValid 
          ? "Formato de NIE válido" 
          : "Formato inválido. Use: Letra + 7 números + letra (ex: X1234567A)";
      case 'dni':
        return isValid 
          ? "Formato de DNI válido" 
          : "Formato inválido. Use: 8 números + letra (ex: 12345678A)";
      default:
        return "";
    }
  };

  return (
    <div className={`flex items-center gap-2 text-sm mt-1 ${isValid ? 'text-green-600' : 'text-red-500'}`}>
      {isValid ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <AlertTriangle className="h-4 w-4" />
      )}
      <span>{getValidationMessage()}</span>
    </div>
  );
};