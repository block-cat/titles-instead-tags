import Widget from 'flarum/extensions/afrux-forum-widgets-core/common/components/Widget';
import app from 'flarum/forum/app';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Link from "flarum/common/components/Link";
import DiscussionPage from "flarum/forum/components/DiscussionPage";
import Stream from 'flarum/common/utils/Stream';

export default class discussionTitles extends Widget {
    oninit(vnode) {
        super.oninit(vnode);
        // this.loading = true;

        // for ordered pages
        this.pages = [];
    }

    oncreate(vnode) {
        // total number of articles
        this.totalDiscussionCount = Stream(app.data.statistics['discussions'].total);

        if (app.forum.attribute('block-cat.articlePerPage')) {
            this.perPage = Number(app.forum.attribute('block-cat.articlePerPage'));
        } else {
            this.perPage = app.discussions.pageSize;
        }

        this.totalPages = Stream(Math.ceil(this.totalDiscussionCount() / this.perPage));

        const sortParam = app.discussions.sortMap()[app.search.params().sort];

        for (let i = 0; i < this.totalPages(); i++) {
            this.pages.push(i + 1);
            
            // get discussions object
            app.store
                .find('discussions', {
                    sort: sortParam,
                    page: { offset: this.perPage * i },
                })
                .then((results) => {
                    const links = results.payload?.links || {};

                    const page = {
                        number: i + 1,
                        items: results,
                        hasNext: !!links.next,
                        hasPrev: !!links.prev,
                    };
                    app.discussions.pages.push(page);

                    // this.loading = false;
                    m.redraw();
                });
        }
    }

    className() {
        // css class for the container
        return 'discussionTitles-widget';
    }

    icon() {
        // Widget icon.
        // return 'fab fa-hotjar hotwdg';
    }

    title() {
        // Widget title.
        // return app.translator.trans('Lista de discutii');
    }

    content() {
        this.oneTime = [];
        this.pages.map((index) => {
            this.oneTime.push(0);
        });

        this.active = function (discussion) {
            return app.current.matches(DiscussionPage, { discussion: discussion });
        }
        
        if (this.loading) {
            return <LoadingIndicator />;
        }
        
        return (
            <div className="DiscussionTitle">
                <ul className="DiscussionTitle-all">
                    {
                        this.pages.map((index) => {
                            return app.discussions.pages.map((page) => {
                                if (page.number === index && this.oneTime[this.pages.indexOf(index)] == 0) {
                                    this.oneTime[this.pages.indexOf(index)]++;

                                    return page.items.map((discussion) => (
                                        <li className={"DiscussionTitle-title " + (this.active(discussion) ? "active" : '')}>
                                            <Link href={app.route.discussion(discussion)} alt={discussion.title()}>
                                                {/* by Tudor - am adaugat placeholder pentru icon */}
                                                <span class="Button-icon icon TagIcon"></span>
                                                {discussion.title()}
                                            </Link>
                                        </li>
                                    ))
                                }
                            })
                        })
                    }
                </ul>
            </div>
        );
    }
}