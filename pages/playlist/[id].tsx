import { Text } from "@chakra-ui/layout";
import { validateToken } from "../../lib/auth";
import prisma from "../../lib/prisma";
import GradientLayout from "../../components/gradientLayout";

const getBGColor = (id) => {
  const colors = [
    "red",
    "green",
    "yellow",
    "blue",
    "orange",
    "gray",
    "purple",
    "teal",
  ];
  return colors[id - 1] || colors[Math.floor(Math.random() * colors.length)];
};

const Playlist = ({ playlist }) => {
  const color = getBGColor(playlist.id);
  return (
    <GradientLayout
      color={color}
      title={playlist.name}
      subtitle="playlist"
      description={`${playlist.songs.length} songs`}
      image={`https://picsum.photos/400?random=${playlist.id}`}
      roundImage={false}
    >
      <Text color="white">{JSON.stringify(playlist, null, 3)}</Text>
    </GradientLayout>
  );
};

export const getServerSideProps = async ({ query, req }) => {
  const user = validateToken(req.cookies.SPOTICLONE_ACCESS_TOKEN);
  const [playlist] = await prisma.playlist.findMany({
    where: {
      id: +query.id,
      userId: user.id,
    },
    include: {
      songs: {
        include: { artist: { select: { name: true, id: true } } },
      },
    },
  });
  return { props: { playlist } };
};
export default Playlist;
