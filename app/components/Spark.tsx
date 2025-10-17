'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';

export default function Spark() {
  // 8 interactive boxes
  const boxes = [
    { id: 'secret', label: '', img: '/assets/Secret.png', activeImg: '/assets/SecretMenu.png' },
    { id: 'content', label: 'Content', img: '/assets/Flag.png', activeImg: '/assets/FlagActive.png' },
    { id: 'media', label: 'Media', img: '/assets/Layer.png', activeImg: '/assets/LayerActive.png' },
    { id: 'innovation', label: 'Innovation', img: '/assets/Cycle.png', activeImg: '/assets/InnovationActive.png' },
    { id: 'deepsea', label: '', img: '/assets/Summertime Sadness.png', activeImg: '/assets/DeepSea.png' },
    { id: 'suite', label: '', img: '/assets/Suit.png', activeImg: '/assets/SparkSuit.png' },
    { id: 'rewards', label: '', img: '/assets/Magnet.png', activeImg: '/assets/SparkRew.png' },
    { id: 'tech', label: '', img: '/assets/Cloud.png', activeImg: '/assets/SparkTech.png' },
  ];

  // 💠 Box positions
  const positions: Record<string, React.CSSProperties> = {
    secret: { top: '146px', left: '0' },
    content: { top: '293px', left: '146px' },
    media: { top: '293px', left: '290px' },
    innovation: { top: '293px', left: '433px' },
    deepsea: { top: '0', left: '290px' },
    suite: { top: '146px', left: '146px' },
    rewards: { top: '0', left: '433px' },
    tech: { top: '146px', right: '0' },
  };

  // 📱 Medium screen positions
  const positions1: Record<string, React.CSSProperties> = {
    secret: { top: '23%', left: '0%' },
    content: { top: '46%', left: '20%' },
    media: { top: '46%', left: '42%' },
    innovation: { top: '46%', left: '64%' },
    deepsea: { top: '0%', left: '42%' },
    suite: { top: '23%', left: '20%' },
    rewards: { top: '0%', left: '64%' },
    tech: { top: '23%', left: '80%' },
  };

  // 📲 Small screen positions
  const positions2: Record<string, React.CSSProperties> = {
    secret: { top: '22%', left: '8%' },
    content: { top: '47%', left: '25%' },
    media: { top: '47%', left: '44%' },
    innovation: { top: '47%', left: '61%' },
    deepsea: { top: '0%', left: '44%' },
    suite: { top: '22%', left: '25%' },
    rewards: { top: '0%', left: '61%' },
    tech: { top: '22%', left: '80%' },
  };

  const positions3: Record<string, React.CSSProperties> = {
    secret: { top: '22%', left: '8%' },
    content: { top: '47%', left: '25%' },
    media: { top: '47%', left: '44%' },
    innovation: { top: '47%', left: '61%' },
    deepsea: { top: '0%', left: '44%' },
    suite: { top: '22%', left: '25%' },
    rewards: { top: '0%', left: '61%' },
    tech: { top: '22%', left: '80%' },
  };

  // 🔗 Relations (memoized)
  const relations: Record<string, string[]> = useMemo(
    () => ({
      content: ['secret', 'intelligence'],
      media: ['suite', 'deepsea', 'intelligence'],
      innovation: ['rewards', 'tech', 'intelligence'],
    }),
    []
  );

  // 📏 Track screen size
  const [screenSize, setScreenSize] = useState<| 'mobile' | 'small' | 'medium' | 'large'>('large');
  const [activeBoxes, setActiveBoxes] = useState<string[]>([]);
  const [lines, setLines] = useState<{ key: string; d: string }[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const boxRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const intelligenceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) setScreenSize('large');
      else if (width >= 768) setScreenSize('medium');
      else if (width >= 640) setScreenSize('small');
      else setScreenSize('mobile');
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🧠 Hover activates boxes
  const handleHover = (id: string) => {
    const related = relations[id] || [];
    const newActive = Array.from(new Set([id, ...related]));
    setActiveBoxes(newActive);
  };

  const isActive = (id: string) => activeBoxes.includes(id);

  // 📐 Get element center
  const getCenter = (el: HTMLElement | null) => {
    if (!el || !sectionRef.current) return null;
    const sectionRect = sectionRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return {
      x: r.left - sectionRect.left + r.width / 2,
      y: r.top - sectionRect.top + r.height / 2,
    };
  };

  // 🧮 Compute SVG paths
  useEffect(() => {
    if (!activeBoxes.length) {
      if (lines.length) setLines([]);
      return;
    }

    const compute = () => {
      const newLines: { key: string; d: string }[] = [];
      const allRefs: Record<string, HTMLDivElement | null> = { ...boxRefs.current, intelligence: intelligenceRef.current };

      activeBoxes.forEach((sourceId) => {
        const targets = relations[sourceId] || [];
        const fromEl = allRefs[sourceId];
        const from = getCenter(fromEl);
        if (!from) return;

        targets.forEach((t) => {
          const to = getCenter(allRefs[t]);
          if (!to) return;

          const specialSeparatePairs = [
            ['media', 'suite'],
            ['media', 'deepsea'],
            ['innovation', 'tech'],
            ['rewards', 'innovation'],
          ];

          const isSpecialSeparate = specialSeparatePairs.some(
            ([a, b]) => (sourceId === a && t === b) || (sourceId === b && t === a)
          );

          const getPairSign = (a: string, b: string) => {
            const pair = [a, b].sort().join('-');
            const pairSigns: Record<string, number> = {
              'deepsea-media': 1,
              'media-suite': -1,
              'innovation-rewards': -1,
              'innovation-tech': 1,
            };
            return pairSigns[pair] ?? 1;
          };

          const OFFSET = 7.5;
          const sign = getPairSign(sourceId, t);
          let path = '';

          const isSecretContent =
            (sourceId === 'secret' && t === 'content') ||
            (sourceId === 'content' && t === 'secret');

          if (isSecretContent) {
            path = `M ${from.x} ${from.y} L ${to.x} ${from.y} L ${to.x} ${to.y}`;
          } else if (isSpecialSeparate) {
            const midX = from.x + sign * OFFSET;
            path = `M ${from.x} ${from.y} L ${midX} ${from.y} L ${midX} ${to.y} L ${to.x} ${to.y}`;
          } else {
            path = `M ${from.x} ${from.y} L ${from.x} ${to.y} L ${to.x} ${to.y}`;
          }

          const key = `${sourceId}-${t}`;
          const reverseKey = `${t}-${sourceId}`;
          if (!newLines.some(line => line.key === key || line.key === reverseKey)) {
            newLines.push({ key, d: path });
          }
        });
      });

      const newSerialized = JSON.stringify(newLines);
      const oldSerialized = JSON.stringify(lines);
      if (newSerialized !== oldSerialized) {
        setLines(newLines);
      }
    };

    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [activeBoxes, relations, lines]);

  // 🧩 Render
  return (
    <section
      ref={sectionRef}
      className="relative w-full h-full flex justify-center items-center overflow-visible"
    >
      {/* 🕸️ SVG Lines */}
      <svg
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C96F1A" />
            <stop offset="100%" stopColor="#9B00E3" />
          </linearGradient>
        </defs>

        {lines.map((line) => (
          <path
            key={`${line.key}-${activeBoxes.join('-')}`}
            d={line.d}
            stroke="url(#grad)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="draw-line"
          />
        ))}
      </svg>

      {/* 🧠 Spark Intelligence Box */}
      <div
        ref={intelligenceRef}
        id="intelligence"
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 lg:w-[400px] lg:h-[100px] md:w-[300px] md:h-[80px] sm:w-[320px] sm:h-[80px] w-[250px] h-[60px] rounded-2xl p-[3px] shadow-xl transition-all duration-500 ${activeBoxes.length > 0
            ? 'bg-gradient-to-r from-[#00EEFF] to-[#B506C5]'
            : 'bg-transparent border border-gray-200'
          }`}
      >
        <div className="w-full h-full rounded-[17px] bg-white flex justify-center items-center">
          <img
            src="/assets/SparkIntelligence.png"
            alt="Spark Intelligence"
            className="w-[160px]"
          />
        </div>
      </div>

      {/* 🟦 Interactive Boxes */}
      {boxes.map((box) => (
        <div
          key={box.id}
          ref={(el) => {
            if (el) boxRefs.current[box.id] = el;
            else delete boxRefs.current[box.id];
          }}
          onMouseEnter={() => {
            if (!['secret', 'tech', 'suite', 'deepsea', 'rewards'].includes(box.id)) {
              handleHover(box.id);
            }
          }}
          onTouchStart={() => {
            if (!['secret', 'tech', 'suite', 'deepsea', 'rewards'].includes(box.id)) {
              handleHover(box.id);
            }
          }}
          className={`absolute rounded-2xl w-[13%] h-[15%] sm:w-[14%] sm:h-[22%] md:w-[19%] md:h-[25%] lg:w-[119.72px] lg:h-[119.72px] cursor-pointer flex justify-center items-center transition-all duration-300 transform ${isActive(box.id)
              ? 'p-[2px] bg-gradient-to-t from-[#B506C5] to-[#00EEFF] scale-105 shadow-lg'
              : 'p-[2px] bg-gray-300 opacity-70 hover:opacity-100'
            }`}
          style={
            screenSize === 'large'
              ? positions[box.id]
              : screenSize === 'medium'
                ? positions1[box.id]
                : screenSize === 'small'
                  ? positions2[box.id]
                  : positions3[box.id]
          }
        >
          <div className="w-full h-full rounded-[14px] bg-white flex justify-center items-center">
            {box.label !== '' ? (
              <div className="md:absolute flex w-full flex-col h-full items-center text-center justify-center mobile:w-[61.59px] mobilex:h-[61.59px]">
                <img
                  src={isActive(box.id) ? box.activeImg : box.img}
                  alt={box.label}
                  className="transition-all md:w-[50.21px] w-[30px] h-[30px] md:h-[50.21px] sm:w-[35px] sm:h-[35px] mobile:w-[30px] mobile:h-[30px] duration-200 transform"
                />
                <p
                  className={`md:text-[14px] text-[10px] sm:text-[13px] mobile:text-[10px] font-medium transition-all duration-500 ease-out transform ${isActive(box.id)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-3'
                    }`}
                >
                  {box.label}
                </p>
              </div>
            ) : (
              <div className="relative flex px-[29.33px] py-[29.33px] flex-col h-full items-center text-center justify-center">
                <img
                  src={box.img}
                  alt={box.label}
                  className={`absolute w-[30px] h-[30px] transition-all duration-500 ease-out transform ${isActive(box.id)
                      ? 'opacity-0 -translate-y-3'
                      : 'opacity-100 translate-y-0'
                    }`}
                />
                <img
                  src={box.activeImg}
                  alt={box.label}
                  className={`absolute w-[30px] sm:w-full transition-all duration-500 ease-out transform ${isActive(box.id)
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-3'
                    }`}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
