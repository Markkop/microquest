import { useCallback, useEffect, useState } from 'react';
import { useGame } from '../contexts/GameContext';

interface Rewards {
  xp: number;
  credits: number;
  strengthGain: number;
  vitalityGain: number;
  focusGain: number;
}

export const useHarvest = () => {
  const { harvestAvailable, calculateRewards, claimRewards } = useGame();
  const [showModal, setShowModal] = useState(false);
  const [rewards, setRewards] = useState<Rewards>({
    xp: 0,
    credits: 0,
    strengthGain: 0,
    vitalityGain: 0,
    focusGain: 0
  });
  const [isHarvesting, setIsHarvesting] = useState(false);

  // Open modal and load rewards when harvest is available
  useEffect(() => {
    if (harvestAvailable && !showModal) {
      setShowModal(true);
      loadRewards();
    }
  }, [harvestAvailable, showModal]);

  // Load the rewards from the game context
  const loadRewards = useCallback(async () => {
    const calculatedRewards = await calculateRewards();
    setRewards(calculatedRewards);
  }, [calculateRewards]);

  // Handle the claim button click
  const handleClaim = useCallback(async () => {
    setIsHarvesting(true);
    await claimRewards();
    setTimeout(() => {
      setShowModal(false);
      setIsHarvesting(false);
    }, 1000);
  }, [claimRewards]);

  // Close the modal
  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return {
    showModal,
    rewards,
    isHarvesting,
    handleClaim,
    closeModal
  };
}; 