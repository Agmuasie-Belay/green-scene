import VideoBlock from "./VideoBlock";
import PPTBlock from "./PPTBlock";
import MarkdownBlock from "./MarkdownBlock";
import MCQBlock from "./MCQBlock";
import TaskBlock from "./TaskBlock";

const BlockRenderer = ({
  block,
  id,
  onComplete,
  enrollmentId,
  progress,
}) => {
  switch (block.type) {
    case "video":
      return (
        <VideoBlock
          data={block.content}
          title={block.title}
          onVideoComplete={onComplete}
        />
      );
    case "ppt":
      return <PPTBlock data={block.content} title={block.title} />;
    case "markdown":
      return <MarkdownBlock data={block} />;
    case "mcq":
      return (
        <MCQBlock
          data={block}
          id={id}
          blockId={block._id}
          onBlockCompleted={onComplete}
          enrollmentId={enrollmentId}
          progress={progress}
        />
      );

    case "task":
      return (
        <TaskBlock
          data={block.content}
          enrollmentId={enrollmentId}
          taskId={block._id}
          id={id}
        />
      );

    default:
      return null;
  }
};

export default BlockRenderer;
