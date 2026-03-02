import {
  Box,
  Flex,
  Button,
  Text,
  Container,
  HStack,
  IconButton,
  useDisclosure,
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Divider,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();

  const links = [
    { label: "Explore", to: "/modules" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  return (
    <Box
      bg="#0A66C2" // LinkedIn Blue
      borderBottom="1px solid"
      borderColor="rgba(0,191,255,0.1)" // subtle cyan accent
      position="fixed"
      top="0"
      w="full"
      zIndex="50"
      backdropFilter="blur(10px)"
    >
      <Container maxW="1200px">
        <Flex h={16} align="center" justify="space-between" position="sticky">
          {/* LOGO */}
          <Text
            fontSize="xl"
            fontWeight="extrabold"
            letterSpacing="tight"
            bgGradient="linear(to-r, #ffc400, #b9c20a)" // cyan → LinkedIn blue
            bgClip="text"
          >
            <Link to="/">LumiRise</Link>
          </Text>

          {/* DESKTOP NAV */}
          <HStack spacing={10} display={{ base: "none", md: "flex" }}>
            {links.map((link) => {
              const isActive = location.pathname === link.to;

              return (
                <Box key={link.to} position="relative">
                  <Link to={link.to}>
                    <Text
                      fontSize="sm"
                      fontWeight="medium"
                      color={isActive ? "#fff200" : "rgba(255,255,255,0.85)"}
                      _hover={{ color: "#fbff00" }}
                      transition="color 0.2s ease"
                    >
                      {link.label}
                    </Text>
                  </Link>

                  {/* Animated Underline */}
                  {isActive && (
                    <MotionBox
                      layoutId="navbar-underline"
                      position="absolute"
                      bottom="-6px"
                      left="0"
                      right="0"
                      height="2px"
                      bg="#00BFFF" // cyan underline for active
                      borderRadius="full"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </Box>
              );
            })}

            <Link to="/login">
              <Button
                size="sm"
                variant="solid"
                color="#bfc20a"
                bg="#00305a"
                  _hover={{ bg: "#0256ab" }}
                borderRadius="full"
                px={6}
                border="1px solid"
              >
                Login
              </Button>
            </Link>

            <Link to="/signup">
              <Button
                size="sm"

                  bg="#ffd900"
                  color="#0A66C2"
                  _hover={{ bg: "#ffea00" }}
                borderRadius="full"
                px={6}
               
              >
                Sign up
              </Button>
            </Link>
          </HStack>

          {/* MOBILE MENU BUTTON */}
          <IconButton
            display={{ base: "flex", md: "none" }}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            color="white"
            variant="ghost"
            onClick={isOpen ? onClose : onOpen}
            aria-label="Toggle Navigation"
          />
        </Flex>
      </Container>

      {/* MOBILE DRAWER */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="#0A66C2" color="white">
          <DrawerBody mt={10}>
            <VStack align="start" spacing={6}>
              {links.map((link) => (
                <Link key={link.to} to={link.to} onClick={onClose}>
                  <Text fontSize="lg">{link.label}</Text>
                </Link>
              ))}

              <Divider borderColor="rgba(0,191,255,0.2)" />

              <Link to="/login" onClick={onClose}>
                <Button
                  variant="solid"
                  w="full"
                  
                color="#bfc20a"
                bg="#00305a"
                  _hover={{ bg: "#0256ab" }}
                >
                  Login
                </Button>
              </Link>

              <Link to="/signup" onClick={onClose}>
                <Button
                  w="full"
                  bg="#fffb00"
                  color="#0A66C2"
                  _hover={{ bg: "#ffea00" }}
                >
                  Signup
                </Button>
              </Link>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

export default Navbar;