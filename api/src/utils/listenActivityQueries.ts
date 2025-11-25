import run from '#db'
import { loadSQL } from '#utils/loadSQL.ts'

export async function preloadListenActivityQueries() {
    const [
        getStatistics,
        getCurrentlyListening,
        getMostPlayedAlbums,
        getMostPlayedArtists,
        getMostPlayedSongs,
        getSongsPlayedPerDay,
        getTopFiveToday,
        getTopFiveYesterday,
        getTopFiveThisWeek,
        getTopFiveLastWeek,
        getTopFiveThisMonth,
        getTopFiveLastMonth,
        getTopFiveThisYear,
        getTopFiveLastYear,
        getMostActiveUsers,
        getMostSkippingUsers,
        getMostLikedAlbums,
        getMostLikedArtists,
        getMostLikedSongs,
        getMostSkippedAlbums,
        getMostSkippedArtists,
        getMostSkippedSongs,
        getMostPlayedEpisodes,
        getTopFiveEpisodesThisMonth,
        getMostLikedEpisodes
    ] = await Promise.all([
        loadSQL('getStatistics.sql'),
        loadSQL('getCurrentlyListening.sql'),
        loadSQL('getMostPlayedAlbums.sql'),
        loadSQL('getMostPlayedArtists.sql'),
        loadSQL('getMostPlayedSongs.sql'),
        loadSQL('getSongsPlayedPerDay.sql'),
        loadSQL('getTopFiveSongsToday.sql'),
        loadSQL('getTopFiveSongsYesterday.sql'),
        loadSQL('getTopFiveSongsThisWeek.sql'),
        loadSQL('getTopFiveSongsLastWeek.sql'),
        loadSQL('getTopFiveSongsThisMonth.sql'),
        loadSQL('getTopFiveSongsLastMonth.sql'),
        loadSQL('getTopFiveSongsThisYear.sql'),
        loadSQL('getTopFiveSongsLastYear.sql'),
        loadSQL('getMostActiveListenUsers.sql'),
        loadSQL('getMostSkippingUsers.sql'),
        loadSQL('getMostLikedAlbums.sql'),
        loadSQL('getMostLikedArtists.sql'),
        loadSQL('getMostLikedSongs.sql'),
        loadSQL('getMostSkippedAlbums.sql'),
        loadSQL('getMostSkippedArtists.sql'),
        loadSQL('getMostSkippedSongs.sql'),
        loadSQL('getMostPlayedEpisodes.sql'),
        loadSQL('getTopFiveEpisodesThisMonth.sql'),
        loadSQL('getMostLikedEpisodes.sql')
    ])

    const [
        statsResult,
        currentlyListeningResult,
        mostPlayedAlbumsResult,
        mostPlayedArtistsResult,
        mostPlayedSongsResult,
        mostPlayedSongsPerDayResult,
        topFiveTodayResult,
        topFiveYesterdayResult,
        topFiveThisWeekResult,
        topFiveLastWeekResult,
        topFiveThisMonthResult,
        topFiveLastMonthResult,
        topFiveThisYearResult,
        topFiveLastYearResult,
        mostActiveUsersResult,
        mostSkippingUsersResult,
        mostLikedAlbumsResult,
        mostLikedArtistsResult,
        mostLikedSongsResult,
        mostSkippedAlbumsResult,
        mostSkippedArtistsResult,
        mostSkippedSongsResult,
        getMostPlayedEpisodesResult,
        getTopFiveEpisodesThisMonthResult,
        getMostLikedEpisodesResult
    ] = await Promise.all([
        run(getStatistics),
        run(getCurrentlyListening),
        run(getMostPlayedAlbums),
        run(getMostPlayedArtists),
        run(getMostPlayedSongs),
        run(getSongsPlayedPerDay),
        run(getTopFiveToday),
        run(getTopFiveYesterday),
        run(getTopFiveThisWeek),
        run(getTopFiveLastWeek),
        run(getTopFiveThisMonth),
        run(getTopFiveLastMonth),
        run(getTopFiveThisYear),
        run(getTopFiveLastYear),
        run(getMostActiveUsers),
        run(getMostSkippingUsers),
        run(getMostLikedAlbums),
        run(getMostLikedArtists),
        run(getMostLikedSongs),
        run(getMostSkippedAlbums),
        run(getMostSkippedArtists),
        run(getMostSkippedSongs),
        run(getMostPlayedEpisodes),
        run(getTopFiveEpisodesThisMonth),
        run(getMostLikedEpisodes)
    ])

    const stats = statsResult.rows[0]
    const currentlyListening = currentlyListeningResult.rows
    const mostPlayedAlbums = mostPlayedAlbumsResult.rows
    const mostPlayedArtists = mostPlayedArtistsResult.rows
    const mostPlayedSongs = mostPlayedSongsResult.rows
    const mostPlayedSongsPerDay = mostPlayedSongsPerDayResult.rows
    const topFiveToday = topFiveTodayResult.rows
    const topFiveYesterday = topFiveYesterdayResult.rows
    const topFiveThisWeek = topFiveThisWeekResult.rows
    const topFiveLastWeek = topFiveLastWeekResult.rows
    const topFiveThisMonth = topFiveThisMonthResult.rows
    const topFiveLastMonth = topFiveLastMonthResult.rows
    const topFiveThisYear = topFiveThisYearResult.rows
    const topFiveLastYear = topFiveLastYearResult.rows
    const mostActiveUsers = mostActiveUsersResult.rows
    const mostSkippingUsers = mostSkippingUsersResult.rows
    const mostLikedAlbums = mostLikedAlbumsResult.rows
    const mostLikedArtists = mostLikedArtistsResult.rows
    const mostLikedSongs = mostLikedSongsResult.rows
    const mostSkippedAlbums = mostSkippedAlbumsResult.rows
    const mostSkippedArtists = mostSkippedArtistsResult.rows
    const mostSkippedSongs = mostSkippedSongsResult.rows
    const MostPlayedEpisodes = getMostPlayedEpisodesResult.rows
    const TopFiveEpisodesThisMonth = getTopFiveEpisodesThisMonthResult.rows
    const MostLikedEpisodes = getMostLikedEpisodesResult.rows

    return {
        stats,
        currentlyListening,
        mostPlayedAlbums,
        mostPlayedArtists,
        mostPlayedSongs,
        mostPlayedSongsPerDay,
        topFiveToday,
        topFiveYesterday,
        topFiveThisWeek,
        topFiveLastWeek,
        topFiveThisMonth,
        topFiveLastMonth,
        topFiveThisYear,
        topFiveLastYear,
        mostActiveUsers,
        mostSkippingUsers,
        mostLikedAlbums,
        mostLikedArtists,
        mostLikedSongs,
        mostSkippedAlbums,
        mostSkippedArtists,
        mostSkippedSongs,
        MostPlayedEpisodes,
        TopFiveEpisodesThisMonth,
        MostLikedEpisodes
    }
}
