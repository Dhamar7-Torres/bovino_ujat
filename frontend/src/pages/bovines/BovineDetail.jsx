import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  MapPin, 
  Calendar, 
  Scale, 
  Tag, 
  Heart,
  Camera,
  Download,
  Share2,
  MoreVertical,
  User,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Baby,
  Zap
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

const BovineDetail = () => {
  // Estados para manejar los datos y la UI
  const [bovineData, setBovineData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  // Animaciones para los componentes
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, delay: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  // Cargar datos del bovino al montar el componente
  useEffect(() => {
    fetchBovineData();
  }, [id]);

  // Obtener datos del bovino
  const fetchBovineData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/bovines/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBovineData(data);
      } else if (response.status === 404) {
        setError('Bovine not found');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load bovine data');
      }
    } catch (error) {
      console.error('Fetch bovine error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar bovino
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/bovines/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        navigate('/bovines', { 
          state: { 
            message: 'Bovine deleted successfully!' 
          }
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete bovine');
      }
    } catch (error) {
      console.error('Delete bovine error:', error);
      setError('Connection error. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Calcular edad
  const calculateAge = (birthDate) => {
    if (!birthDate) return 'Unknown';
    
    const today = new Date();
    const birth = new Date(birthDate);
    const ageInMs = today - birth;
    const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
    
    if (ageInDays < 30) {
      return `${ageInDays} days old`;
    } else if (ageInDays < 365) {
      const months = Math.floor(ageInDays / 30);
      return `${months} month${months > 1 ? 's' : ''} old`;
    } else {
      const years = Math.floor(ageInDays / 365);
      const remainingMonths = Math.floor((ageInDays % 365) / 30);
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''} old`;
    }
  };

  // Obtener icono de estado de salud
  const getHealthStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'sick':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'injured':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'pregnant':
        return <Baby className="w-5 h-5 text-blue-500" />;
      case 'lactating':
        return <Heart className="w-5 h-5 text-pink-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  // Obtener color de estado de salud
  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sick':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'injured':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'pregnant':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lactating':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Compartir información del bovino
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${bovineData.name} - Bovine Details`,
          text: `Check out details for ${bovineData.name} (Tag: ${bovineData.tagNumber})`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bovine details...</p>
        </motion.div>
      </div>
    );
  }

  // Mostrar error
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-xl shadow-lg p-8 max-w-md mx-4"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Bovine</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex space-x-3 justify-center">
            <button
              onClick={fetchBovineData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/bovines"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to List
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/bovines"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Bovines
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-xl font-semibold text-gray-900">
                {bovineData?.name} ({bovineData?.tagNumber})
              </h1>
            </div>

            {/* Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showMoreMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50"
                >
                  <div className="py-1">
                    <Link
                      to={`/bovines/edit/${bovineData.id}`}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowMoreMenu(false)}
                    >
                      <Edit className="w-4 h-4 mr-3" />
                      Edit Bovine
                    </Link>
                    <button
                      onClick={() => {
                        handleShare();
                        setShowMoreMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Share2 className="w-4 h-4 mr-3" />
                      Share
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
                        setShowMoreMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-3" />
                      Delete Bovine
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Columna izquierda - Información principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tarjeta principal */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Header con foto */}
              <div className="relative h-64 bg-gradient-to-r from-green-400 to-blue-500">
                {bovineData.image ? (
                  <img
                    src={bovineData.image}
                    alt={bovineData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Camera className="w-16 h-16 text-white opacity-50" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getHealthStatusColor(bovineData.healthStatus)}`}>
                    {getHealthStatusIcon(bovineData.healthStatus)}
                    <span className="text-sm font-medium capitalize">
                      {bovineData.healthStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Información básica */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {bovineData.name}
                    </h2>
                    <p className="text-gray-600">
                      {bovineData.breed} • {bovineData.gender} • {calculateAge(bovineData.birthDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-gray-600 mb-1">
                      <Tag className="w-4 h-4 mr-1" />
                      <span className="text-sm">Tag Number</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {bovineData.tagNumber}
                    </p>
                  </div>
                </div>

                {/* Grid de información */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <motion.div
                    variants={itemVariants}
                    className="text-center p-3 bg-gray-50 rounded-lg"
                  >
                    <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 mb-1">Birth Date</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(bovineData.birthDate).toLocaleDateString()}
                    </p>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="text-center p-3 bg-gray-50 rounded-lg"
                  >
                    <Scale className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 mb-1">Weight</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {bovineData.weight ? `${bovineData.weight} kg` : 'Not recorded'}
                    </p>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="text-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400"></div>
                    <p className="text-xs text-gray-600 mb-1">Color</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {bovineData.color || 'Not specified'}
                    </p>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="text-center p-3 bg-gray-50 rounded-lg"
                  >
                    <Clock className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <p className="text-xs text-gray-600 mb-1">Registered</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {new Date(bovineData.createdAt).toLocaleDateString()}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Parentesco */}
            {(bovineData.motherTagNumber || bovineData.fatherTagNumber) && (
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-green-600" />
                  Parentage
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bovineData.motherTagNumber && (
                    <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                      <p className="text-sm text-pink-600 mb-1">Mother</p>
                      <p className="font-medium text-gray-900">{bovineData.motherTagNumber}</p>
                    </div>
                  )}
                  
                  {bovineData.fatherTagNumber && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-600 mb-1">Father</p>
                      <p className="font-medium text-gray-900">{bovineData.fatherTagNumber}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Notas */}
            {bovineData.notes && (
              <motion.div
                variants={cardVariants}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Notes
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {bovineData.notes}
                </p>
              </motion.div>
            )}
          </div>

          {/* Columna derecha - Ubicación y acciones */}
          <div className="space-y-6">
            {/* Ubicación */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                Registration Location
              </h3>
              
              {bovineData.latitude && bovineData.longitude ? (
                <div className="space-y-4">
                  {/* Mapa placeholder */}
                  <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Map View</p>
                      <p className="text-xs text-gray-500">
                        {bovineData.latitude.toFixed(6)}, {bovineData.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>
                  
                  {bovineData.address && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Address</p>
                      <p className="text-sm font-medium text-gray-900">
                        {bovineData.address}
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => window.open(`https://www.google.com/maps?q=${bovineData.latitude},${bovineData.longitude}`, '_blank')}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                  >
                    View on Google Maps
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No location data recorded</p>
                </div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              variants={cardVariants}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Link
                  to={`/bovines/edit/${bovineData.id}`}
                  className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Information
                </Link>
                
                <Link
                  to={`/health-records/add?bovineId=${bovineData.id}`}
                  className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Add Health Record
                </Link>
                
                <Link
                  to={`/vaccinations/add?bovineId=${bovineData.id}`}
                  className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Schedule Vaccination
                </Link>
                
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full flex items-center justify-center px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Bovine
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Bovine</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{bovineData.name}</strong> (Tag: {bovineData.tagNumber})? 
              This will permanently remove all data associated with this bovine.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
              >
                {isDeleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Click outside para cerrar menú */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMoreMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default BovineDetail;