import Head from 'next/head'
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@chakra-ui/react';
import hexToRGB from '../utils/hexToRGB';
import isDarkBG from '../utils/isDarkBG';
import SideBar from '../components/SideBar';

const colors = {
  tw: require('../colors/tailwind'),
  chakra: require('../colors/chakra-ui'),
  mui: require('../colors/mui'),
  ant: require('../colors/ant-design')
}

const heroImages = {
  tw: '/tailwindcss-logo.svg',
  chakra: '/chakra-logomark.svg',
  mui: '/mui-logo.svg',
  ant: '/antdesign-logo.svg'
}

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [currentTab, setCurrentTab] = useState('tw');
  const [showRGB, setShowRGB] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOldView, setIsOldView] = useState(false);
  const [showSettings, setShowSettings] = useState(false)

  const isInitialRender = useRef(true);

  useEffect(() => {
    if(isInitialRender.current) {
      const item = window.localStorage.getItem('isDark');
      if(item) {
        const bool = item === 'true' ? true : false;
        setIsDark(bool);
      } else {
        window.localStorage.setItem('isDark', isDark);
      }
      isInitialRender.current = false;
    } else {
      const item = window.localStorage.setItem('isDark', isDark);
    }

  }, [isDark])

  const toast = useToast();

  let rgb;

  function copyToClipboard(color) {
    const obj = hexToRGB(color);
    rgb = `rgb(${obj.r}, ${obj.g}, ${obj.b})`;
    if(showRGB) {
      window.navigator.clipboard.writeText(rgb);
      return;
    }
    window.navigator.clipboard.writeText(color);
  }

  return (
    <div>
      <Head>
        <title>Expertly-crafted color palettes in one place.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={`${isDark ? 'dark' : ''}`}>
        <SideBar isDark={isDark} setIsDark={setIsDark} currentTab={currentTab} setCurrentTab={setCurrentTab} showRGB={showRGB} setShowRGB={setShowRGB} isExpanded={isExpanded} setIsExpanded={setIsExpanded} isOldView={isOldView} setIsOldView={setIsOldView} showSettings={showSettings} setShowSettings={setShowSettings} />
        <main className={`pb-24 min-h-screen sm:pl-16 sm:pb-16 bg-pattern dark:bg-pattern bg-fixed`}>
          <div className="flex justify-center py-10">
            <img className="h-14 sm:h-24" src={heroImages[currentTab]} alt=""/>
          </div>

          {/* row view */}
          <div className={`px-10 space-y-8 ${isOldView ? 'block' : 'hidden'}`}>
            {
            colors[currentTab].map(([key, value], index) => (
              <section key={index}>
              <h2 className="text-center uppercase text-sm font-bold text-gray-800 dark:text-white">{key}</h2>
              <div className="flex flex-wrap justify-center text-gray-700">
                {
                Object.entries(value).map(([key, value], index) => (
                <div className="mr-4 mt-2" key={index}>
                  <div className="flex justify-between">
                    <div className="text-xs dark:text-gray-500">{key}</div>
                    <div className="text-xs dark:text-gray-500">{value.toUpperCase()}</div>
                  </div>
                  <div 
                    onClick={() => {
                      copyToClipboard(value);
                      toast({
                        title: `Color ${showRGB ? rgb : value.toUpperCase()} copied to clipboard`,
                        description: `To copy ${showRGB ? 'hex' : 'rgb'} values click the ${!showRGB ? 'RGB' : 'HEX'} button in settings`,
                        status: "success",
                        duration: 6000,
                        isClosable: true,
                        position: 'top-right',
                      })
                    }} 
                    className="h-8 w-20 rounded shadow cursor-pointer" style={{backgroundColor: value}}
                    >
                    </div>
                </div>
                ))
                }
              </div>
              </section>
            ))
            }
          </div>

          {/* column view */}
          <div className={`mt-6 ${!isOldView ? 'grid' : 'hidden'} gap-x-8 gap-y-12 px-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:px-20`}>
            {colors[currentTab].map(([key, value], index) => (
              <div key={index}>
                <span className="inline-block px-5 py-2 uppercase text-xs box-border" style={{backgroundColor: value[50]}}>{key}</span>
                {Object.entries(value).map(([ikey, ivalue], index) => (
                  <div
                    onClick={() => {
                      copyToClipboard(ivalue);
                      toast({
                        title: `Color ${showRGB ? rgb : ivalue.toUpperCase()} copied to clipboard`,
                        description: `To copy ${showRGB ? 'hex' : 'rgb'} values click the ${!showRGB ? 'RGB' : 'HEX'} button in settings`,
                        status: "success",
                        duration: 6000,
                        isClosable: true,
                        position: 'top-right',
                      })
                    }} 
                    key={index}
                    className={`h-10 w-full flex justify-between items-center px-6 text-xs uppercase font-mono cursor-pointer`}
                    style={{backgroundColor: ivalue, color: isDarkBG(ivalue) ? value[900] : value[100] }}
                  >
                    <span>{ikey}</span>
                    <span>{ivalue}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
