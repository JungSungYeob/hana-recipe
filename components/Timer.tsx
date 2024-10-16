'use client';

import { useState, useEffect } from 'react';

export default function Timer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [alarmSound, setAlarmSound] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Audio 객체 생성 (알람 소리 파일 경로 설정)
    const sound = new Audio('/sounds/alarm.mp3');
    setAlarmSound(sound);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning) {
      const endTime = Date.now() + seconds * 1000; // 종료 시간 계산
      timer = setInterval(() => {
        const timeLeft = endTime - Date.now();
        if (timeLeft <= 0) {
          clearInterval(timer);
          setIsRunning(false);
          setRemainingTime(0);
          if (alarmSound) {
            alarmSound.play(); // 알람 소리 재생
          }
        } else {
          setRemainingTime(timeLeft); // 남은 시간 업데이트
        }
      }, 1); // 밀리초 단위로 업데이트
    }

    return () => {
      // 타이머 해제
      clearInterval(timer);
    };
  }, [isRunning, seconds, alarmSound]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    if (alarmSound) {
      alarmSound.pause();
    }
  };

  const handleReset = () => {
    if (alarmSound) {
      alarmSound.pause();
    }
    setRemainingTime(0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeconds(Number(e.target.value));
  };

  return (
    <div className='border rounded-md p-4 w-fit'>
      <input
        className='rounded-md px-2 py-1 max-w-32 w-full'
        type='number'
        onChange={handleChange}
        placeholder='Seconds'
        disabled={isRunning}
      />
      {!isRunning ? (
        <button
          className='btn text-sm'
          onClick={handleStart}
          disabled={isRunning}
        >
          Start Timer
        </button>
      ) : (
        <button
          className='btn bg-red-600 hover:bg-red-900 hover:text-white text-sm'
          onClick={handleStop}
        >
          Stop Timer
        </button>
      )}
      <button
        className='btn bg-blue-600 text-sm hover:bg-blue-900 hover:text-white'
        disabled={isRunning}
        onClick={handleReset}
      >
        Reset
      </button>

      <p>
        {Math.floor(remainingTime / 1000)}s {Math.floor(remainingTime % 1000)}ms
      </p>
    </div>
  );
}
