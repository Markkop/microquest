import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../contexts/GameContext';
import { Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HarvestModal: React.FC = () => {
  const { t } = useTranslation();
  const { harvestAvailable, calculateRewards, claimRewards } = useGame();
  const [showModal, setShowModal] = useState(false);
  const [rewards, setRewards] = useState({
    xp: 0,
    credits: 0,
    strengthGain: 0,
    vitalityGain: 0,
    focusGain: 0
  });
  const [isHarvesting, setIsHarvesting] = useState(false);

  useEffect(() => {
    if (harvestAvailable && !showModal) {
      setShowModal(true);
      loadRewards();
    }
  }, [harvestAvailable]);

  const loadRewards = async () => {
    const calculatedRewards = await calculateRewards();
    setRewards(calculatedRewards);
  };

  const handleClaim = async () => {
    setIsHarvesting(true);
    await claimRewards();
    setTimeout(() => {
      setShowModal(false);
      setIsHarvesting(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="p-5">
              <div className="flex justify-center mb-4">
                <motion.div
                  className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles size={32} />
                </motion.div>
              </div>
              
              <h2 className="text-xl font-bold text-center mb-4">{t('harvest.title')}</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('harvest.xpEarned')}</span>
                  <span className="font-bold text-primary-700">+{rewards.xp} XP</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{t('harvest.creditsEarned')}</span>
                  <span className="font-bold text-accent-600">+{rewards.credits} {t('common.credits')}</span>
                </div>
                
                {rewards.strengthGain > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('stats.strength')}:</span>
                    <span className="font-bold text-error-500">+{rewards.strengthGain}</span>
                  </div>
                )}
                
                {rewards.vitalityGain > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('stats.vitality')}:</span>
                    <span className="font-bold text-success-500">+{rewards.vitalityGain}</span>
                  </div>
                )}
                
                {rewards.focusGain > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('stats.focus')}:</span>
                    <span className="font-bold text-warning-500">+{rewards.focusGain}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <motion.button
                className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-medium rounded-lg shadow"
                onClick={handleClaim}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isHarvesting}
              >
                {isHarvesting ? (
                  <span>{t('harvest.claiming')}</span>
                ) : (
                  <span>{t('harvest.claimContinue')}</span>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HarvestModal;