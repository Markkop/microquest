import { Check, Clock } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { Task } from "../db/database";
import { useStatIcon } from "../hooks/useStatIcon";
import { useTasks } from "../hooks/useTasks";
import Button from "./ui/Button";
import Card from "./ui/Card";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { t } = useTranslation();
  const { completeTask, isTaskAvailable, getTimeRemaining } = useTasks();
  const { getStatIcon } = useStatIcon();

  // Format time remaining display
  const formatTimeRemaining = () => {
    const timeLeft = getTimeRemaining(task);
    if (!timeLeft) return null;

    const { hours, minutes } = timeLeft;

    if (hours > 0) {
      return t("task.timeRemaining.hours", { hours, minutes });
    }
    return t("task.timeRemaining.minutes", { minutes });
  };

  const timeRemaining = formatTimeRemaining();
  const isAvailable = isTaskAvailable(task);

  return (
    <Card
      interactive={isAvailable && !task.isDone}
      disabled={!isAvailable || task.isDone}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getStatIcon(task.stat)}
            <span className="text-xs font-medium capitalize text-gray-500">
              {t(`stats.${task.stat}`)}
            </span>
            <span className="text-xs text-primary-600 font-medium ml-auto">
              +{task.xpValue} XP
            </span>
          </div>
          <p
            className={`text-gray-900 font-medium ${
              task.isDone ? "line-through" : ""
            }`}
          >
            {task.title}
          </p>
          {timeRemaining && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <Clock size={12} />
              <span>{timeRemaining}</span>
            </div>
          )}
        </div>

        {isAvailable ? (
          !task.isDone ? (
            <Button
              variant="icon"
              className="ml-4 border border-primary-200 text-primary-600 hover:bg-primary-50"
              onClick={() => completeTask(task.id!)}
              icon={<Check size={16} />}
            />
          ) : (
            <div className="ml-4 h-8 w-8 rounded-full flex items-center justify-center bg-primary-100 text-primary-600">
              <Check size={16} />
            </div>
          )
        ) : (
          <div className="ml-4 h-8 w-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-400">
            <Clock size={16} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default TaskCard;
