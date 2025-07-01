import React from 'react'
import ComingSoon from '@/components/common/ComingSoon/ComingSoon'

const ForgotPassword = () => {
  return (
    <ComingSoon 
      pageName="Recuperar Contraseña"
      description="La funcionalidad de recuperación de contraseña estará disponible próximamente."
      features={[
        "Recuperación por email",
        "Códigos de verificación seguros",
        "Restablecimiento automático",
        "Historial de cambios de contraseña"
      ]}
      showBackButton={true}
    />
  )
}

export default ForgotPassword