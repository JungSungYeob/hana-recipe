'use client'

import { useState, useEffect } from 'react';

const Timer = () => {
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
      }, 50); // 밀리초 단위로 업데이트

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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeconds(Number(e.target.value));
  };

  return (
    <div>
      <h1>Timer</h1>
      <input
        type="number"
        onChange={handleChange}
        placeholder="Seconds"
      />
      <button className='btn' onClick={handleStart} disabled={isRunning}>
        Start Timer
      </button>
      <button className='btn' onClick={handleStop} disabled={!isRunning}>
        Stop Timer
      </button>
      <p>Remaining Time: {remainingTime.toFixed(0)} ms</p>
    </div>
  );
};

export default Timer;
