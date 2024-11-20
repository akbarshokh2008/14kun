"use client";

import React, { useState, useEffect } from "react";
import Robot from "./assets/robot.svg";

export default function RobotOyini() {
  const Setka = 10;
  const [robotX, setRobotX] = useState(0);
  const [robotY, setRobotY] = useState(0);
  const [qutilar, setQutilar] = useState([
    { x: 3, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 6, y: 4 },
    { x: 1, y: 5 },
    { x: 2, y: 6 },
    { x: 4, y: 7 },
  ]);
  const [qutiUshlangan, setQutiUshlangan] = useState(false);
  const [ushlganQutiIndeksi, setUshlganQutiIndeksi] = useState(-1);
  const [buyruq, setBuyruq] = useState("");
  const [buyruqlarRuyxati, setBuyruqlarRuyxati] = useState([]);
  const [animatsiyaJarayonida, setAnimatsiyaJarayonida] = useState(false);

  useEffect(() => {
    if (animatsiyaJarayonida) {
      const timer = setTimeout(() => setAnimatsiyaJarayonida(false), 300);
      return () => clearTimeout(timer);
    }
  }, [animatsiyaJarayonida]);

  function buyruqlarniBajar() {
    const buyruqlar = buyruq.toUpperCase();
    setBuyruqlarRuyxati([...buyruqlarRuyxati, buyruqlar])
    let hozirgiX = robotX;
    let hozirgiY = robotY;
    let hozirgiQutilar = [...qutilar];
    let ushlanmoqda = qutiUshlangan;
    let ushlganQuti = ushlganQutiIndeksi;

    function keyingiBuyruqniBajar(index) {
      if (index >= buyruqlar.length) {
        setBuyruq("");
        return;
      }

      const cmd = buyruqlar[index];
      setAnimatsiyaJarayonida(true);

      if (cmd === "R") {
        if (hozirgiX < Setka - 1) hozirgiX++;
      } else if (cmd === "L") {
        if (hozirgiX > 0) hozirgiX--;
      } else if (cmd === "T") {
        if (hozirgiY > 0) hozirgiY--;
      } else if (cmd === "B") {
        if (hozirgiY < Setka - 1) hozirgiY++;
      } else if (cmd === "O") {
        if (!ushlanmoqda) {
          const qutiIndeksi = hozirgiQutilar.findIndex(
            (quti) => quti.x === hozirgiX && quti.y === hozirgiY
          );
          if (qutiIndeksi !== -1) {
            ushlanmoqda = true;
            ushlganQuti = qutiIndeksi;
          }
        }
      } else if (cmd === "Q") {
        if (ushlanmoqda && ushlganQuti !== -1) {
          hozirgiQutilar[ushlganQuti] = { x: hozirgiX, y: hozirgiY };
          ushlanmoqda = false;
          ushlganQuti = -1;
        }
      }

      setRobotX(hozirgiX);
      setRobotY(hozirgiY);
      setQutilar(hozirgiQutilar);
      setQutiUshlangan(ushlanmoqda);
      setUshlganQutiIndeksi(ushlganQuti);

      setTimeout(() => {
        setAnimatsiyaJarayonida(false);
        keyingiBuyruqniBajar(index + 1);
      }, 300);
    }

    keyingiBuyruqniBajar(0);
  }

  const setkaKatakchasi = [];
  for (let y = 0; y < Setka; y++) {
    for (let x = 0; x < Setka; x++) {
      const robotBor = robotX === x && robotY === y;
      const qutiBor = qutilar.some((quti, qutiIndeksi) => {
        if (quti.x === x && quti.y === y) {
          return qutiUshlangan ? ushlganQutiIndeksi !== qutiIndeksi : true;
        }
        return false;
      });

      setkaKatakchasi.push(
        <div
          key={`${x}-${y}`}
          className="w-10 h-10 border border-gray-300 flex justify-center items-center bg-white"
        >
          {robotBor && <img src={Robot} alt="" width={20} />}
          {qutiBor && (
            <div
              className={`w-7 h-7 rounded transition-all duration-300 ${
                qutiUshlangan && robotX === x && robotY === y
                  ? "bg-black"
                  : "bg-orange-500"
              } ${animatsiyaJarayonida ? "transform scale-110" : ""}`}
            />
          )}
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col items-center gap-5 p-5">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${Setka}, 40px)`,
          gap: "1px",
          backgroundColor: "#ccc",
          padding: "1px",
        }}
      >
        {setkaKatakchasi}
      </div>

      <div className="flex w-full max-w-[400px] gap-2">
        <input
          type="text"
          value={buyruq}
          onChange={(e) => {
            setBuyruq(e.target.value);
          }}
          placeholder="Buyruqlarni kiriting (masalan, RRBBBORRQ)"
          className="flex-grow px-4 py-2 text-lg border border-gray-300 rounded"
        />
        <button
          onClick={buyruqlarniBajar}
          disabled={animatsiyaJarayonida}
          className={`px-4 py-2 text-lg ${
            animatsiyaJarayonida ? "bg-gray-300" : "bg-blue-500"
          } text-white border-none rounded cursor-${
            animatsiyaJarayonida ? "not-allowed" : "pointer"
          }`}
        >
          OK
        </button>
      </div>

      <div className="text-sm text-gray-600">
        Buyruqlar: R (O'ngga), L (Chapga), T (Yuqoriga), B (Pastga), O (Olish),
        Q (Qo'yish)
      </div>
      <div className="buyruqlar-ruyxati">
        <h3 className="font-bold text-2xl pb-5">Buyruqlar ruyxati</h3>
       <div>
        {buyruqlarRuyxati.map((value, index)=>{
          return <p key={index}><span>{index+ 1} - buyruq</span>{value}</p>
        })}
       </div>
      </div>
    </div>
  );
}
