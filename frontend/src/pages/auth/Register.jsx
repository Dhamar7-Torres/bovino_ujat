import React from 'react'
import ComingSoon from '@/components/common/ComingSoon/ComingSoon'

const Register = () => {
  return (
    <ComingSoon 
      pageName="Registro de Usuario"
      description="El registro de nuevos usuarios estará disponible próximamente. Por ahora, contacta al administrador para obtener acceso."
      features={[
        "Registro automático de usuarios",
        "Verificación por email",
        "Diferentes niveles de acceso",
        "Integración con sistema de permisos"
      ]}
      estimatedDate="Febrero 2024"
      showBackButton={true}
    />
  )
}

export default Register