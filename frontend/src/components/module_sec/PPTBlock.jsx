import { Box, Text } from "@chakra-ui/react";

const PPTBlock = ({ data, title }) => {
  // const embedUrl = data.path?.includes("/embed")
  //   ? data.path
  //   : `${data.path}/embed`;
const url = data.url;
console.log("PPT URL:", url);
  return (
    <Box mb={6}>
      <Text fontSize="lg" fontWeight="bold" p={4}>
        {title || "Reading Lesson"}
      </Text>

      <iframe
        src={url}
        width="100%"
        height="420px"
        frameBorder="0"
        allowFullScreen
        mozAllowFullScreen="true"
        webkitAllowFullScreen="true"
        style={{
          borderRadius: "0px",
        }}
      />
    </Box>
  );
};

export default PPTBlock;
