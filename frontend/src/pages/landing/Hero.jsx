import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const Hero = () => {
  const glassBg = useColorModeValue(
    "rgba(255,255,255,0.08)",
    "rgba(255,255,255,0.04)"
  );
  const glassBorder = useColorModeValue(
    "rgba(255,255,255,0.2)",
    "rgba(255,255,255,0.1)"
  );

  const gradientBg = "linear(to-br, #0A66C2, #0056A0, #0A66C2)";

  return (
    <Box position="relative" >
      <MotionBox
        position="relative"
        bgGradient={gradientBg}
        py={{ base: 24, md: 40 }}
        overflow="hidden"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .5, ease: "easeOut" }}
      >
        {/* Floating Glowing Particles */}
        {/* <Box position="absolute" inset={0} zIndex={0} pointerEvents="none">
          {[...Array(35)].map((_, i) => (
            <MotionBox
              key={i}
              position="absolute"
              w="6px"
              h="6px"
              borderRadius="full"
              bg={i % 2 === 0 ? "#0A66C2" : "#00BFFF"} // LinkedIn Blue & cyan
              boxShadow={`0 0 12px ${i % 2 === 0 ? "#0A66C2" : "#00BFFF"}`}
              top={`${Math.random() * 100}%`}
              left={`${Math.random() * 100}%`}
              animate={{ y: [0, -30, 0], opacity: [0.3, 0.85, 0.3] }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </Box> */}

        <Container maxW="container.xl" position="relative" zIndex={1}>
          <Box
            backdropFilter="blur(20px)"
            bg={glassBg}
            border="1px solid"
            borderColor={glassBorder}
            borderRadius="2xl"
            p={{ base: 8, md: 12 }}
            boxShadow="0 20px 60px rgba(0,0,0,0.5)"
          >
            <VStack spacing={6} align="center" textAlign="center">
              {/* Heading Glow */}
              <Box position="relative" display="inline-block">
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  w="450px"
                  h="450px"
                  bg="radial-gradient(circle, rgba(191, 194, 10, 0.3) 0%, rgba(251, 255, 0, 0.15) 40%, transparent 50%)"
                  filter="blur(60px)"
                  zIndex={0}
                />
                <MotionBox
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  <Heading
                    position="relative"
                    zIndex={1}
                    fontSize={{ base: "3xl", md: "5xl" }}
                    fontWeight="extrabold"
                    letterSpacing="tight"
                    bgGradient="linear(to-r, #c29d0a, #ddff00)"
                    bgClip="text"
                  >
                    Bridge the gap. <br/>Rise beyond.
                  </Heading>
                </MotionBox>
              </Box>

              {/* Subtitle */}
              <MotionBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Text
                  fontSize={{ base: "md", md: "xl" }}
                  maxW="2xl"
                  color="rgba(255,255,255,0.9)"
                >
                  Equip learners with in-demand skills, mentorship, and hands-on projects—building confidence and creating career-ready innovators.
                </Text>
              </MotionBox>

              {/* Call to Action */}
              <MotionBox
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link to="/signup">
                  <Button
                    size="lg"
                    bg="#bcb904" // Cyan CTA for contrast
                    color="black"
                    _hover={{
                      bg: "#d4ff00",
                      boxShadow: "0 0 12px #fffb00",
                    }}
                    boxShadow="0 0 4px #00BFFF"
                  >
                    Start Your Journey
                  </Button>
                </Link>
              </MotionBox>
            </VStack>
          </Box>
        </Container>
      </MotionBox>
    </Box>
  );
};

export default Hero;