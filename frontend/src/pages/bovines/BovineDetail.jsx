import React from 'react'
import ComingSoon from '@/components/common/ComingSoon/ComingSoon'

const BovineDetail = () => {
  return (
    <ComingSoon 
      pageName="Detalle de Bovino"
      description="Visualiza toda la información detallada de un bovino específico."
      features={[
        "Información completa del animal",
        "Historial de salud y tratamientos",
        "Registro de producción",
        "Genealogía y descendencia",
        "Galería de fotos",
        "Ubicación en tiempo real"
      ]}
    />
  )
}

export default BovineDetail