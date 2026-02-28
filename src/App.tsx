import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionTemplate } from 'motion/react';
import { Phone, MessageCircle, Share2, ChevronDown, Copy, Check, ExternalLink, ArrowUp } from 'lucide-react';

// --- Components ---

const AnimatedTitle = React.memo(({ title, progress, start, end, center }: { 
  title: string, 
  progress: any, 
  start: number, 
  end: number,
  center: number
}) => {
  const titleOpacity = useTransform(progress, [start - 0.04, start, end - 0.04, end], [0, 1, 1, 0]);
  const titleY = useTransform(progress, [start - 0.05, start, end - 0.05, end], [30, 0, 0, -30]);
  
  const titleColor = useTransform(
    progress, 
    [start, center, end], 
    ["#18181b", "#10b981", "#18181b"]
  );
  
  // Grouping Chinese characters into 2-char words to prevent awkward 5+1 wrapping
  const words = title.match(/[\u4e00-\u9fa5]{2}|./g) || [];
  let charIndex = 0;

  return (
    <motion.h2 
      style={{ 
        opacity: titleOpacity, 
        y: titleY, 
        color: titleColor,
        display: "flex",
        flexWrap: "wrap",
        willChange: "transform, opacity"
      }}
      className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 tracking-tighter leading-[1.1] max-w-xl"
    >
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block whitespace-nowrap">
          {word.split("").map((char) => {
            const i = charIndex++;
            return (
              <Character 
                key={i} 
                char={char} 
                index={i} 
                progress={progress} 
                start={start} 
                end={end} 
              />
            );
          })}
        </span>
      ))}
    </motion.h2>
  );
});

const Character = React.memo(({ char, index, progress, start, end }: { 
  char: string, 
  index: number, 
  progress: any, 
  start: number, 
  end: number 
}) => {
  // Staggered timing for each character
  const stagger = index * 0.003;
  
  const charY = useTransform(
    progress,
    [start - 0.05 + stagger, start + stagger, end - 0.05, end],
    [15, 0, 0, -15]
  );

  const charOpacity = useTransform(
    progress,
    [start - 0.05 + stagger, start + stagger, end - 0.05, end],
    [0, 1, 1, 0]
  );

  const charScale = useTransform(
    progress,
    [start - 0.05 + stagger, start + stagger, end - 0.05, end],
    [0.95, 1, 1, 0.95]
  );

  return (
    <motion.span
      style={{ 
        opacity: charOpacity,
        y: charY,
        scale: charScale,
        display: "inline-block",
        willChange: "transform, opacity",
      }}
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
});

const ProductTextItem = React.memo(({ product, index, total, progress }: { 
  product: any, 
  index: number, 
  total: number, 
  progress: any 
}) => {
  const sectionSize = 1 / total;
  const start = index * sectionSize;
  const end = (index + 1) * sectionSize;
  const center = (start + end) / 2;

  const baseOpacity = useTransform(progress, [start - 0.05, start, end - 0.05, end], [0, 1, 1, 0]);
  const titleOpacity = useTransform(progress, [start - 0.04, start, end - 0.04, end], [0, 1, 1, 0]);
  const descOpacity = useTransform(progress, [start - 0.02, start + 0.02, end - 0.02, end], [0, 1, 1, 0]);
  const btnOpacity = useTransform(progress, [start, start + 0.04, end, end + 0.04], [0, 1, 1, 0]);
  const descY = useTransform(progress, [start - 0.03, start + 0.02, end - 0.03, end], [30, 0, 0, -30]);
  const btnY = useTransform(progress, [start - 0.01, start + 0.04, end - 0.01, end], [15, 0, 0, -15]);
  const pointerEvents = useTransform(baseOpacity, (v) => v > 0.1 ? "auto" : "none");

  return (
    <motion.div
      style={{ 
        opacity: baseOpacity, 
        position: 'absolute', 
        pointerEvents,
        willChange: "opacity"
      }}
      className="w-full"
    >
      <motion.span 
        style={{ opacity: titleOpacity }}
        className="text-emerald-500 font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block"
      >
        产品系列 0{index + 1}
      </motion.span>
      
      <AnimatedTitle 
        title={product.title}
        progress={progress}
        start={start}
        end={end}
        center={center}
      />

      <motion.p 
        style={{ 
          opacity: descOpacity, 
          y: descY,
          willChange: "transform, opacity"
        }}
        className="text-lg md:text-xl text-zinc-500 leading-relaxed font-light max-w-md"
      >
        {product.description}
      </motion.p>

      <motion.div 
        style={{ 
          opacity: btnOpacity, 
          y: btnY,
          willChange: "transform, opacity"
        }}
        className="mt-12 flex items-center gap-4 group/btn cursor-pointer"
      >
        <div className="h-[2px] w-16 bg-zinc-900 transition-all duration-300 group-hover/btn:w-24 group-hover/btn:bg-emerald-500" />
        <span className="text-sm font-black text-zinc-900 group-hover/btn:text-emerald-500 transition-colors">EXPLORE</span>
      </motion.div>
    </motion.div>
  );
});

const ProductImageItem = React.memo(({ product, index, total, progress }: { 
  product: any, 
  index: number, 
  total: number, 
  progress: any 
}) => {
  const sectionSize = 1 / total;
  const start = index * sectionSize;
  const end = (index + 1) * sectionSize;
  const center = (start + end) / 2;

  const opacity = useTransform(progress, [start - 0.08, start, end - 0.08, end], [0, 1, 1, 0]);
  const scale = useTransform(progress, [start, start + sectionSize / 2, end], [0.85, 1.1, 0.85]);
  const rotate = useTransform(progress, [start, end], [index % 2 === 0 ? -10 : 10, index % 2 === 0 ? 10 : -10]);
  const pointerEvents = useTransform(opacity, (v) => v > 0.1 ? "auto" : "none");

  return (
    <motion.div
      style={{ 
        opacity, 
        scale, 
        rotate,
        zIndex: total - index,
        position: 'absolute',
        pointerEvents,
        willChange: "transform, opacity"
      }}
      className="w-full h-full flex items-center justify-center"
    >
      <div className="relative flex flex-col items-center">
        {/* Image Label */}
        <motion.div 
          style={{ opacity: useTransform(opacity, [0, 0.2, 0.8, 1], [0, 1, 1, 0]) }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="h-[1px] w-4 bg-emerald-500/30" />
          <span className="text-xs font-black tracking-[0.4em] text-zinc-900 uppercase whitespace-nowrap">
            {product.title}
          </span>
          <div className="h-[1px] w-4 bg-emerald-500/30" />
        </motion.div>

        <motion.div 
          className="relative group cursor-pointer"
          whileHover="hover"
          initial="initial"
          style={{ transformStyle: "preserve-3d" }}
        >
        {/* Multi-layered Glow System - Restored for depth */}
        <motion.div 
          variants={{
            initial: { opacity: 0, scale: 0.8, filter: "blur(40px)" },
            hover: { opacity: 0.8, scale: 1.4, filter: "blur(80px)", transition: { duration: 0.8 } }
          }}
          className="absolute inset-0 bg-emerald-400/30 rounded-full -z-10 will-change-[transform,opacity,filter]" 
        />
        <motion.div 
          variants={{
            initial: { opacity: 0, scale: 0.6, filter: "blur(20px)" },
            hover: { opacity: 0.4, scale: 1.1, filter: "blur(40px)", transition: { duration: 0.5, delay: 0.1 } }
          }}
          className="absolute inset-0 bg-white/40 rounded-full -z-10 will-change-[transform,opacity,filter]" 
        />

        <motion.img 
          src={product.image} 
          alt={product.title} 
          variants={{
            initial: { 
              scale: 1, 
              filter: "brightness(1) contrast(1)", 
              rotateY: 0, 
              rotateX: 0,
              z: 0
            },
            hover: { 
              scale: 1.2, 
              filter: "brightness(1.1) contrast(1.05)", 
              rotateY: 15,
              rotateX: -10,
              z: 50,
              transition: { duration: 0.6, ease: "easeOut" } 
            }
          }}
          style={{ transformStyle: "preserve-3d" }}
          className="w-full max-h-[65vh] object-contain drop-shadow-[0_50px_100px_rgba(0,0,0,0.2)] will-change-transform"
          referrerPolicy="no-referrer"
        />
        
        <motion.div 
          style={{ 
            opacity: useTransform(opacity, [0, 0.2, 0.8, 1], [0, 0.15, 0.15, 0]),
            scale: useTransform(progress, [start, center, end], [1, 1.1, 1])
          }}
          className="absolute inset-0 bg-zinc-200 rounded-full -z-20 blur-[100px] will-change-transform" 
        />
      </motion.div>
    </div>
  </motion.div>
);
});

const Navbar = () => {
// ... (rest of Navbar)
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 px-8 py-4 flex justify-between items-center transition-all duration-500 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-zinc-100 py-4' : 'bg-transparent py-6'
    }`}>
      <div className="text-2xl font-bold tracking-tighter text-zinc-900">卓惠有限公司</div>
      <div className="hidden md:flex gap-8 text-sm uppercase tracking-widest font-medium text-zinc-500">
        <a href="#products" className="hover:text-zinc-900 transition-colors">产品系列</a>
        <a href="#about" className="hover:text-zinc-900 transition-colors">关于我们</a>
        <a href="#contact" className="hover:text-zinc-900 transition-colors">联系我们</a>
      </div>
    </nav>
  );
};

const ProductsContainer = ({ products }: { products: any[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Smooth out the scroll progress for a premium feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} id="products" className="relative h-[600vh] bg-white">
      {/* Sticky Main Container */}
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        <div className="container mx-auto px-8 md:px-24 grid grid-cols-1 md:grid-cols-2 items-center h-full gap-12">
          
          {/* Left Side: Sticky Text Content */}
          <div className="relative h-[60vh] flex items-center">
              {products.map((product, index) => (
                <ProductTextItem 
                  key={index}
                  product={product}
                  index={index}
                  total={products.length}
                  progress={smoothProgress}
                />
              ))}
            </div>

            {/* Right Side: Sticky Image Content */}
            <div className="relative h-full flex items-center justify-center">
              <div className="relative w-full aspect-square flex items-center justify-center">
                {products.map((product, index) => (
                  <ProductImageItem 
                    key={index}
                    product={product}
                    index={index}
                    total={products.length}
                    progress={smoothProgress}
                  />
                ))}
            </div>
          </div>

        </div>
      </div>
      
      {/* Scroll Spacer to drive the sticky progress */}
      <div className="h-full w-full pointer-events-none" />
    </div>
  );
};

const ContactButton = ({ icon: Icon, label, value, onClick, type }: { 
  icon: any; 
  label: string; 
  value: string; 
  onClick?: () => void;
  type: 'tel' | 'copy' | 'link';
}) => {
  const [copied, setCopied] = useState(false);

  const handleAction = () => {
    if (type === 'tel') {
      window.location.href = `tel:${value}`;
    } else if (type === 'copy') {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else if (type === 'link') {
      window.open(value, '_blank');
    }
    if (onClick) onClick();
  };

  return (
    <button 
      onClick={handleAction}
      className="group relative flex items-center gap-4 p-6 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-xl hover:border-zinc-200 transition-all duration-300 w-full max-w-md"
    >
      <div className="p-4 bg-zinc-50 rounded-xl group-hover:bg-zinc-900 group-hover:text-white transition-colors">
        <Icon size={24} />
      </div>
      <div className="text-left">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-1">{label}</p>
        <p className="text-lg font-medium text-zinc-900">{value}</p>
      </div>
      <div className="ml-auto">
        {type === 'copy' ? (
          copied ? <Check className="text-emerald-500" size={20} /> : <Copy className="text-zinc-300 group-hover:text-zinc-900" size={20} />
        ) : type === 'tel' ? (
          <Phone className="text-zinc-300 group-hover:text-zinc-900" size={20} />
        ) : (
          <ExternalLink className="text-zinc-300 group-hover:text-zinc-900" size={20} />
        )}
      </div>
    </button>
  );
};

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      setVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[90] p-4 bg-zinc-900 text-white rounded-full shadow-2xl hover:bg-emerald-500 transition-colors group"
        >
          <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const products = [
    {
      title: "极简喷头系列",
      description: "采用航空级不锈钢材质，多层增压技术，为您带来如丝般顺滑的沐浴体验。每一滴水都经过精心雕琢，让洗浴成为一种艺术享受。",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop", // Shower head
    },
    {
      title: "全铜加厚水管",
      description: "精选优质黄铜，加厚管壁设计，耐高压、抗腐蚀。卓惠水管，连接您的品质生活，确保每一滴水的纯净与安全。",
      image: "https://images.unsplash.com/photo-1542013936693-884638332954?q=80&w=1000&auto=format&fit=crop", // Copper pipes
    },
    {
      title: "智能恒温水龙头",
      description: "精准控温，即开即热。极简几何设计语言，完美融合现代家居美学。这不仅是一个开关，更是对生活细节的极致追求。",
      image: "https://images.unsplash.com/photo-1585338447937-7082f8fc763d?q=80&w=1000&auto=format&fit=crop", // Faucet
    }
  ];

  const [showWeChatModal, setShowWeChatModal] = useState(false);
  const [showDouyinModal, setShowDouyinModal] = useState(false);

  return (
    <div className="relative bg-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1 className="text-7xl md:text-[10rem] font-bold tracking-tighter text-zinc-900 mb-6">
            卓惠有限公司
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 font-light tracking-[0.5em] uppercase">
            水暖洁具 · 极简美学 · 品质生活
          </p>
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 text-zinc-300"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest font-bold">探索更多</span>
            <ChevronDown size={24} />
          </div>
        </motion.div>
      </section>

      {/* Animated Product Sections - 400vh tall to allow scrolling through all 3 items */}
      <ProductsContainer products={products} />

      {/* About Section */}
      <section id="about" className="min-h-screen flex items-center justify-center bg-zinc-900 text-white px-8 py-24 relative z-20">
        <div className="max-w-4xl text-center">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-xs font-bold tracking-[0.3em] uppercase text-zinc-500 mb-8 block"
          >
            关于我们 / ABOUT US
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold mb-12 leading-tight"
          >
            卓惠，致力于重新定义<br />
            <span className="text-zinc-500">现代家庭的用水体验</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-zinc-400 leading-relaxed font-light"
          >
            我们成立于2015年，始终坚持“以简为美，以质为本”的经营理念。
            从一颗小小的螺丝到复杂的恒温系统，我们对每一个细节都近乎苛求。
            卓惠不仅售卖洁具，更是在传递一种简约而不简单的生活方式。
          </motion.p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex flex-col items-center justify-center bg-white px-8 py-24 relative z-20">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className="text-5xl md:text-7xl font-bold text-zinc-900 mb-8 tracking-tighter">
              开启您的<br />品质之旅
            </h2>
            <p className="text-xl text-zinc-500 font-light mb-12">
              如果您对我们的产品感兴趣，或者有任何合作意向，欢迎通过以下方式联系我们。
            </p>
            <div className="flex flex-col gap-4">
              <ContactButton 
                icon={Phone} 
                label="电话联系" 
                value="13388389977" 
                type="tel" 
              />
              <ContactButton 
                icon={MessageCircle} 
                label="微信咨询" 
                value="czhll1998315" 
                type="copy"
                onClick={() => setShowWeChatModal(true)}
              />
              <ContactButton 
                icon={Share2} 
                label="抖音号" 
                value="czh19751209" 
                type="copy"
                onClick={() => setShowDouyinModal(true)}
              />
            </div>
          </div>
          
          <div className="relative aspect-square bg-zinc-50 rounded-3xl overflow-hidden group shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop" 
              alt="Showroom" 
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-zinc-900/10 group-hover:bg-transparent transition-colors" />
          </div>
        </div>

        <footer className="mt-24 pt-12 border-t border-zinc-100 w-full text-center text-zinc-400 text-sm">
          <p>© 2024 卓惠有限公司 版权所有 | 极简主义水暖洁具专家</p>
        </footer>
      </section>

      {/* WeChat Modal */}
      <AnimatePresence>
        {showWeChatModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowWeChatModal(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-12 rounded-3xl shadow-2xl max-w-sm w-full text-center"
            >
              <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle size={48} />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">添加微信</h3>
              <p className="text-zinc-500 mb-8">微信号已复制到剪贴板<br />请在微信中搜索并添加</p>
              <div className="bg-zinc-50 p-4 rounded-xl font-mono text-zinc-900 mb-8 select-all">
                czhll1998315
              </div>
              <button 
                onClick={() => setShowWeChatModal(false)}
                className="w-full py-4 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors"
              >
                我知道了
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Douyin Modal */}
      <AnimatePresence>
        {showDouyinModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDouyinModal(false)}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-12 rounded-3xl shadow-2xl max-w-sm w-full text-center"
            >
              <div className="w-24 h-24 bg-zinc-50 text-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Share2 size={48} />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">关注抖音</h3>
              <p className="text-zinc-500 mb-8">抖音号已复制到剪贴板<br />请在抖音中搜索并关注</p>
              <div className="bg-zinc-50 p-4 rounded-xl font-mono text-zinc-900 mb-8 select-all">
                czh19751209
              </div>
              <button 
                onClick={() => setShowDouyinModal(false)}
                className="w-full py-4 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors"
              >
                我知道了
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BackToTop />
    </div>
  );
}
