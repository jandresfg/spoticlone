import { validateToken } from "../../lib/auth";
import prisma from "../../lib/prisma";

const Playlist = ({ playlist }) => (
  <div>Playlist with id {`${playlist.id}`}</div>
);

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
