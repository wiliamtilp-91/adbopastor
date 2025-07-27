import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirecionar para a página de boas-vindas
    navigate('/');
  }, [navigate]);

  return null;
};

export default Index;
