/*
|--------------------------------------------------------------------------
| Global View
|--------------------------------------------------------------------------
*/

views.libraryList = React.createClass({

    render: function() {

        var content;

        if(this.props.library === null) {
            content = (
                <div className={'full-message'}>
                    <p>{ "Loadin\' stuff..." }</p>
                </div>
            );
        }
        else if (this.props.library.length == 0) {
            content = (
                <div className={'full-message'}>
                    <p>Too bad, there is no music in your library =(</p>
                    <p className='sub-message'>you may need to refresh your library or add folders into it.</p>
                </div>
            );
        }
        else if (this.props.tracks.length == 0) {
            content = (
                <div className={'full-message'}>
                    <p>Your search returned no results, sorry :/</p>
                </div>
            );
        }
        else {
            content = (
                <div>
                    <LibraryListItems
                        tracks={ this.props.tracks }
                        trackPlayingID={ this.props.trackPlayingID }
                    />
                </div>
            );
        }

        return (
            <div className={'view view-library-list'} >
                { content }
            </div>
        );
    }
});



/*
|--------------------------------------------------------------------------
| Child - ArtistList
|--------------------------------------------------------------------------
*/

var LibraryListItems = React.createClass({

    getInitialState: function () {
        return {
            selected: []
        };
    },

    render: function() {

        var self           = this;
        var selected       = this.state.selected;
        var tracks         = this.props.tracks;
        var trackPlayingID = this.props.trackPlayingID;
        var playing        = null;

        var list = tracks.map(function(track, index) {

            if(trackPlayingID != null) {
                if(track._id == trackPlayingID) var playing = (<i className={'fa fa-fw fa-volume-up'}></i>);
                if(track._id == trackPlayingID && audio.paused) var playing = (<i className={'fa fa-fw fa-volume-off'}></i>);
            }

            return(
                <tr className={ selected.indexOf(index) != -1 ? 'track selected' : 'track' } key={index} onMouseDown={ self.selectTrack.bind(null, index) } onDoubleClick={ Instance.selectAndPlay.bind(null, index, event) } onContextMenu={ self.showContextMenu }>
                    <td className={'row-trackPlaying text-center'}>
                        { playing }
                    </td>
                    <td className={'row-track'}>
                        { track.title }
                    </td>
                    <td className={'row-duration'}>
                        { parseDuration(track.duration) }
                    </td>
                    <td className={'row-artist'}>
                        { track.artist[0] }
                    </td>
                    <td className={'row-album'}>
                        { track.album }
                    </td>
                    <td className={'row-genre'}>
                        { track.genre.join(', ') }
                    </td>
                </tr>
            );
        });

        return (
            <div className={'tracks-list-container'}>
                <table className={'table table-striped tracks-list'}>
                    <thead>
                        <tr>
                            <th className={'row-trackPlaying'}><div><i className={'fa fa-fw'}></i></div></th>
                            <th className={'row-track'}><div>Track</div></th>
                            <th className={'row-duration'}><div>Duration</div></th>
                            <th className={'row-artist'}><div>Artist</div></th>
                            <th className={'row-album'}><div>Album</div></th>
                            <th className={'row-genre'}><div>Genre</div></th>
                        </tr>
                    </thead>
                    <tbody>
                        { list }
                    </tbody>
                </table>
            </div>
        );
    },

    selectTrack: function(index) {

        this.setState({ selected: index });
    },

    showContextMenu: function(e) {

        var context = new Menu();

        context.append(new MenuItem({ label: 'Add to queue', click: function() { console.log('add to queue'); } }));
        context.append(new MenuItem({ label: 'Play next', click: function() { console.log('play next'); } }));

        context.popup(remote.getCurrentWindow());
    }
});
