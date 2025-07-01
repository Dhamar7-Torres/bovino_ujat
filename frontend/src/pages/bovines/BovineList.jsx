import React from 'react'
import ComingSoon from '@/components/common/ComingSoon/ComingSoon'

const BovinesList = () => {
  return (
    <ComingSoon 
      pageName="Lista de Bovinos"
      description="Gestiona todos los bovinos de tu rancho con una interfaz intuitiva y funcionalidades avanzadas."
      features={[
        "Lista completa con filtros avanzados",
        "Búsqueda por múltiples criterios",
        "Exportación de datos",
        "Vista de tarjetas y tabla",
        "Códigos QR para identificación",
        "Seguimiento de genealogía"
      ]}
      estimatedDate="Enero 2024"
    />
  )
}

export default BovinesList