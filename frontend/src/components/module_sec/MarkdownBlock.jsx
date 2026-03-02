import {
  Box,
  Heading,
  Text,
  Link,
  UnorderedList,
  OrderedList,
  ListItem,
  Code,
  Divider,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";

const MarkdownBlock = ({ data }) => {
  return (
    <Box
      p={6}
      bg="white"
      borderRadius="xl"
      borderBottomRadius={0}
      border="1px solid"
      borderColor="gray.200"
      _dark={{ bg: "gray.700", borderColor: "gray.600" }}
    >
      {data.title && (<>
        <Heading size="lg" mb={4} color="blue.500">
          {data.title}
        </Heading>
        <Divider borderColor="blue.400" mb={4} /></>
      )}
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <>
              <Heading as="h1" size="xl" color="blue.600" my={4} {...props} />
              <Divider borderColor="blue.400" mb={4} />
            </>
          ),
          h2: ({ node, ...props }) => (
            <Heading as="h2" size="lg" my={3} {...props} />
          ),
          h3: ({ node, ...props }) => (
            <Heading as="h3" size="md" my={2} {...props} />
          ),
          p: ({ node, ...props }) => (
            <Text fontSize="md" mb={2} lineHeight="tall" {...props} />
          ),
          a: ({ node, ...props }) => (
            <Link
              color="blue.500"
              textDecoration="underline"
              {...props}
              isExternal
            />
          ),
          ul: ({ node, ...props }) => (
            <UnorderedList pl={6} mb={2} spacing={1} {...props} />
          ),
          ol: ({ node, ...props }) => (
            <OrderedList pl={6} mb={2} spacing={1} {...props} />
          ),
          li: ({ node, ...props }) => <ListItem mb={1} {...props} />,
          code: ({ node, inline, ...props }) =>
            inline ? (
              <Code colorScheme="blue" fontSize="0.85em" {...props} />
            ) : (
              <Box
                as="pre"
                p={4}
                my={2}
                rounded="md"
                bg="gray.100"
                _dark={{ bg: "gray.600" }}
                overflowX="auto"
              >
                <Code display="block" whiteSpace="pre" {...props} />
              </Box>
            ),
          blockquote: ({ node, ...props }) => (
            <Box
              borderLeft="4px solid"
              borderColor="blue.400"
              pl={4}
              py={2}
              my={2}
              bg="blue.50"
              _dark={{ bg: "blue.900", borderColor: "blue.300" }}
              rounded="md"
              {...props}
            />
          ),
        }}
      >
        {data.content}
      </ReactMarkdown>
    </Box>
  );
};

export default MarkdownBlock;
