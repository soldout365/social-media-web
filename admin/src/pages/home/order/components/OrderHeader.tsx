import { motion } from "framer-motion";
import { FONTS } from "../../dashboard/components/theme";

interface OrderHeaderProps {
  title: string;
  description: string;
}

export default function OrderHeader({ title, description }: OrderHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mb-12"
    >
      <h1
        className="text-4xl font-light tracking-tight text-[#111111] mb-2"
        style={{ fontFamily: FONTS.sans }}
      >
        {title}
      </h1>
      <p className="text-[#787774]" style={{ fontFamily: FONTS.sans }}>
        {description}
      </p>
    </motion.header>
  );
}
