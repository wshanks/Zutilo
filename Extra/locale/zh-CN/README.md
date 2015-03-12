Zutilo
======

Zutilo 是用作[Zotero Firefox 扩展](http://www.zotero.org/)插件的一个 Firefox 小扩展。
Zutilo 被设计为一个工具集，来提供一些 Zotero 未提供的小功能。
它的名称部分使用了单词“utility”并让它的发音像“Zotero”。
所有 Zutilo 的图形元素都可以被单独禁用，所有不需要的功能不会弄乱用户界面。

当前功能列表
------------

### 键盘快捷键 ###
大部分 Zutilo 功能都可以通过右键点击 Zotero 或 Firefox 相关元素出现的上下文菜单来访问。
很多时候直接通过键盘访问 Zutilo 的功能比使用上下文菜单更有用。
Zutilo 目前不提供原生的键盘快捷键(未来的更新可能会提供键盘快捷键)。

不过可以使用其他 Firefox 插件来映射 Zutilo 的功能到键盘快捷键。
例如 [Keyconfig](http://forums.mozillazine.org/viewtopic.php?t=72994)， 它提供了一个简单的界面，可以映射键盘快捷键到 Javascript 命令，并且适用于 Firefox 和 Zotero 独立版，或者 [Pentadactyl](http://5digits.org/pentadactyl/index) 或 [Vimperator](http://www.vimperator.org/vimperator)，它们都为 Firefox 提供了更高级的命令行界面。
在下面功能的描述中，同时给出了对应的函数名。

它们是要不使用上下文菜单映射到的函数。
.
.

### 项目菜单功能 ###
下面的所有功能都可以从 Zotero 项目菜单中访问(在 Zotero 中列出所有项目的位置的项目面板上点击右键打开)。
在 Zutilo 首选项(从与 Zetero 首选项相同的菜单中访问)，这些功能每个都可以设置在 Zotero 项目菜单中显示，或者在 Zotero 的 Zutilo 子菜单中，或者完全不显示。

* __复制标签：__
    右键点击 Zotero 库中的项目并将它们的标签作为一个“\r\n”分隔的列表到剪贴板。
    对于 Zotero 4.0，这样的标签列表可以复制到一个新的标签框中，一次性为一个项目添加所有标签。
    (函数名：`ZutiloChrome.zoteroOverlay.copyTags()`)。

* __粘贴标签：__
    右键点击 Zotero 库中的项目并粘贴剪贴板的内容到项目中。
    剪贴板内容必须是“\r\n”或“\n”分隔的列表(例如通过上面介绍的复制标签功能创建的列表)。
    (函数名：`ZutiloChrome.zoteroOverlay.pasteTags()`)。

* __复制创建者：__
    右键点击 Zotero 库中的项目并将它们的创建者作为一个“\r\n”分隔的列表复制到剪贴板。
    (函数名：`ZutiloChrome.zoteroOverlay.copyCreators()`)。

* __查看附件路径：__
    为选中的附件项目和选中的常规项目的附件显示路径(逐个作为独立对话窗口显示——最好一次不要选择太多项目！)。
    (函数名：`ZutiloChrome.zoteroOverlay.showAttachments()`)。

* __修改附件路径：__
    为选中的附件和选中的常规项目的所有附件中符合条件的项目更改路径的开始部分。
    会出现两个提示窗口。
    第一个窗口会询问旧的部分路径，第二个窗口会询问新的部分路径。
    如果你输入“C:/userData/references/”作为第一个路径，输入“E:/”作为第二个路径，那么路径为“C:/userData/references/journals/Nature/2008/coolPaper.pdf”的附件的路径将会被更改为“E:/journals/Nature/2008/coolPaper.pdf”，而路径为“E:/journals/Science/2010/neatPaper.pdf”的附件保持不变。
    此功能主要在你更换计算机或者硬盘时所有附件路径损坏时使用。

    默认情况下，只会比较旧的部分路径和每个附件路径的开始部分。
    要更改不在开始部分的附件路径，请在第一个提示窗口中点击“替换所有实例”复选框。
    此选项主要在你想要重命名子文件夹或者在 Windows 和 Unix 风格路径(替换`\`和`/``)的时候使用
    (函数名：`ZutiloChrome.zoteroOverlay.modifyAttachments()`)。

* __关联项目：__
    设置所有选中的项目相互关联。
    (函数名：`ZutiloChrome.zoteroOverlay.relateItems()`)。

* __Copy select item links:__
	Copy links of the form "zotero://select/items/ITEM_ID" to the clipboard for each selected item.
	Pasting such a link into the Firefox address bar will select the corresponding item in the Zotero Firefox plugin.
	Following links from other applications and having the links select items in the Zotero Standalone client may also be achievable but might require additional set up.

* __Copy Zotero URIs:__
	Copy (www.zotero.org) links to the clipboard for each selected item.
	If you have a (www.zotero.org) profile, following such a link will open the page for the corresponding item in profile on (www.zotero.org).
	If you do not have a (www.zotero.org) profile, a placeholder link is still generated but might not be useful.

### 项目编辑功能 ###

Zutilo 目前实现了一些在使用键盘编辑 Zotero 项目是有用的功能。
这些功能不能从任何图形元素访问(但是可以像前面介绍的一样分配键盘快捷键)。
在仅选中一个 Zotero 项目时可以使用下列功能：

* __编辑项目信息：__
    在项目面板中选择“信息”标签。
    设置焦点到项目信息的第一个可编辑的域。
    (函数名：`ZutiloChrome.zoteroOverlay.editItemInfoGUI()`)。
* __添加注释：__
    在项目面板中选择“注释”标签。
    创建一个新的注释。
    为了完整性添加，Zotero 已有键盘快捷键进行此操作。
    它可以在 Zotero 首选项中设置。
    (函数名：`ZutiloChrome.zoteroOverlay.addNoteGUI()`)。
* __添加标签：__
    在项目面板中选择“标签”标签。
    打开文本框来创建新标签。
    (函数名：`ZutiloChrome.zoteroOverlay.addTagGUI()`)。
* __添加关联项目：__
    在项目面板中选择“关联”标签。
    打开添加关联项目的对话。
    (函数名：`ZutiloChrome.zoteroOverlay.addRelatedGUI()`)。

### Navigating and hiding panes ###

Zutilo implements several functions that are useful for navigating between and within the three main panes.
These functions can not be called from any graphical element (but can be assigned to a keyboard shortcut as described above).

* __Focus collections pane:__
    Set the focus to the collections pane (left pane, Libraries pane).
    Added for completeness, but Zotero already has a keyboard shortcut that does this.
* __Focus items pane:__
    Set the focus to the items pane (middle pane).

The following four functions are similar to the four item editing functions above, except that they just set focus on the respective tab in the item pane.

* __Focus item pane: Info tab:__
    Select the "Info" tab in the item pane.
* __Focus item pane: Notes tab:__
    Select the "Notes" tab of the item pane.
* __Focus item pane: Tags tab:__
    Select the "Tags" tab of the item pane.
* __Focus item pane: Related tab:__
    Select the "Related" tab of the item pane.

The following two functions allow you to cycle through the same four tags in the item pane.

* __Focus item pane: next tab:__
    Select next tab in item pane.
* __Focus item pane: previous tab:__
    Select previous tab in item pane.

The following two functions allow you to easily show or hide the collections pane (left pane) and the item pane (right pane).

* __Item pane: Show / hide:__
    Show or hide the item pane.
* __Collections pane: Show / hide:__
    Show or hide the collections pane.

The following two functions achieve the same, i.e. they allow you to easily show or hide the collections pane (left pane) and the item pane (right pane).
However, when the pane is shown, the thicker vertical divider ("splitter", "grippy", appears when the pane is hidden) remains visible until the width of the pane is adjusted. 

* __Item pane: Show / hide (sticky):__
    Show or hide the item pane.
    When the pane is show, the thicker vertical divider remains visible until the width of the pane is adjusted.
* __Collections pane: Show / hide (sticky):__
    Show or hide the collections pane.
    When the pane is show, the thicker vertical divider remains visible until the width of the pane is adjusted.

### Firefox 浏览器功能 ###

Zutilo 添加了一些功能来协助从 Firefox 页面中附加文档到 Zotero 项目。
这些功能需要从 Firefox 浏览器中访问，不支持 Zotero 独立版。

* __附加网页和链接到 Zotero 项目：__
    Zutilo 为 Firefox 添加了上下文菜单项目来附加当前页面或者当前链接目标(如果选中了链接)到当前选择的 Zotero 项目。
    如何处理附件取决于 Zutilo 首选项中的附件方式设置。
    如果方式是“导入”，会从页面/链接创建一个导入的附件。
    如果方式是“询问链接的文件”，会出现提示，允许用户指定一个新文件。
    页面/链接将被保存在这个文件中然后会创建一个链接的文件附件(链接到下载的文件)。
    如果方式是“首次后询问”，那么如果选中的项目之前没有附件(不计入网页截图附件)将会创建导入附件。
    否则，会提示创建链接的文件附件。
    如果激活附件函数时按下了 shift 键，会忽略 Zutilo 的设置，提示链接文件。
    如果按下了 ctrl 键，会忽略 Zutilo 的设置，导入附件。

    如果你想要使用 Zutilo 首选项中的方法设置来创建键盘快捷键附加当前页面到当前 Zotero 项目，请使用 `ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(window.content.location.href)` 命令。
    一般调用的函数是 `ZutiloChrome.firefoxOverlay.attachURLToCurrentItem(url, processType)`，其中 `url` 是要下载的 URL 字符串，processType 可以是“Zotero”、“prompt”或者“promptAfterOne”。
    如果 processType 未指定或者被设置为其他，那么将使用 Zutilo 首选项中设置的附加方法。

* __从当前网页抽取 Zotero 项目带附件/不带附件：__
    Zutilo 添加了一个菜单项到 Zotero 的状态栏图标，它可以从当前页面导出带附加/不带附件，页面关联的 PDF 和其他文件。
    也就是，如果 Zetero 的首选项中“自动附加 PDF 和其他文件”被选中，那么 Zutilo 会添加菜单项(为每个应用到当前页面的“保存的 Zetero” 分别添加项目)用来创建新的无附件的 Zotero 项目。
    如果该首选项未被选中，Zutilo 会添加创建带附加的新 Zotero 项目的菜单项。

    此功能是通过切换 Zotero 中关联的文件首选项实现的，创建项目，然后将首选项切换回它初始的状态。
    因为 Zotero 异步地转换页面(并且是同时的)，通过此功能进行的转换需要被允许在 Zotero 正常转换页面开始前完成(否则“关联文件”的首选项会依赖于进行同时转换的时机)。

    此功能基于的函数是 `ZutiloChrome.firefoxOverlay.scrapeThisPage(translator, filesBool)`。
    如果 translator (Zotero translator 对象)被设置为 false 或者未设置，将使用默认 translator 来转换页面。
    如果 filesBool 是 true，那么项目将被创建为带附件的。
    如果未指定 filesBool，那么将使用与 Zotero 默认设置想法的行为。
    所以，如果 Zotero 的首选项中“自动附加 PDF 和其他文件”选择被选中，`ZutiloChrome.firefoxOverlay.scrapeThisPage(false)` 将使用默认页面转换器创建无附加文件的项目。
    .

### 基本 Zotero 函数 ###

这里列出了一些 Zotero 的其他函数以供参考，我认为它们会在映射键盘快捷键时有用：

* __切换 Zotero：__
    在 Firefox 中显示/隐藏 Zotero 面板。
    (函数名：`ZoteroOverlay.toggleDisplay()`)。
* __保存网页为 Zotero 项目：__
    在 Zotero 中保存当前页面为网页项目。
    (函数名：`ZoteroPane.addItemFromPage()`)。
* __从网页中提取 Zotero 项目：__
    根据当前网页的参考内容添加项目到 Zotero 库中(相当于点击 Firefox 中的页面/书本图标)。
    (函数名：`Zotero_Browser.scrapeThisPage()`)。

### 关于附件的注意事项 ###

Zutilo 提供了一些功能更强大的控制 Zotero 附件的管理。
下面是 Zotero 附件的一些可能用法，以此来给出 Zutilo 的一些可能的用法。

Zotero 提供了一个元数据的富界面来组织和导出参考文献。
它也可以被用来当做一个更强大的文件浏览器，通过附加文件到 Zotero 项目。
这些项目可以通过搜索 Zotero 的数据库字段来取回(例如作者、标题、标签、出版社、年份等)，它比简单的文件系统搜索更加精细。

Zotero 支持两种附件，导入文件和链接文件。
导入文件附件被存储在 Zetero 的存储目录中，每个附件被单独的存储在随机字母和数字组成的字符串命名的文件夹中。
链接文件附件仅保存附件文件在文件系统中的位置链接(所以这些附件可以被保存在更合理的分层的文件中，以便于在 Zotero 外浏览)。

基本的 Zotero 为导入的文件附件提供了比链接的文件附件更多的支持。
使用基本的 Zotero 时，当通过提取网页中的参考信息来创建新项目时，Zotero 也可以下载像导入文件附件那样自动下载网页参考文献关联到的 PDF(或其它)文件。
它也可以同步导入的附件到 Zotero 服务器。

[ZotFile 扩展](http://www.columbia.edu/~jpl2136/zotfile.html)为 Zotero 中的链接文件附件提供了更多的支持。
ZotFile 可以设置为自动转换新导入的文件附件到链接文件附件并重命名和移动附件文件到其它位置，这个位置由附件的父原信息决定。
此功能可以让维护链接文件附件的工作像使用 Zotero 的导入附件一样简单。
ZotFile 也可以批量重命名和移动已存在的附件文件(链接或导入)并将 Firefox 下载文件夹中最近修改的文件作为移动和重命名链接文件附件附加到 Zotero 项目。
(ZotFile 也提供了提取 PDF 注释为 Zotero 笔记项目或者作为同步附件文件到平板设备的功能。)

借助 ZotFile，可以很容易地创建和维护一个链接文件附件库。
然而，这些文件不能被 Zotero 同步到 Zotero 服务器。
从 4.0 版本起，Zotero 支持链接文件附件的相对路径。
对于用相对路径保存的链接文件附件，用户的 Zotero 库可以在多个设备间同步，只要包含所有链接文件附件的基本目录被复制到了每个设备上(或者附件文件可以被存储在网络硬盘上，并且每个设备将它作为基本目录)，所有链接文件的链接将会继续可用。

Zutilo 的修改附件路径函数可以帮助处理链接文件附件，通过批量修改所有选中的附件的部分路径。
所以如果一组附件文件被移动到了一个新文件夹，Zutilo 的修改附件的函数可以被用来一次更新所有链接附件的路径。
此函数也可以在更换操作系统时用来更改附件路径中的`/`为`\`。
Zotero 4.0 的相对路径功能替代了此函数的需求，不过修改路径的功能仍然在由于某些原因不能讲附件路径设为相对路径时有用。
Zutilo 的显示附件路径函数也在调试当前保存在 Zotero 中的附件路径时有用，特别是对于损坏的路径，这样路径可以被修改路径函数来修改而不是被单独地重新链接。

Zutilo 的页面和链接附加函数在附加最初创建时漏掉的文件或者稍后附加更多项目到 Zotero 项目时有用。
附加依照正常的程序创建，所以这些函数可以被用来创建导入的文件附件(默认行为)或者链接文件附件如果 ZotFile 被设置为自动重命名和移动新附件。
注意使用 Zutilo 的文件提醒选项附加页面/链接也会触发 ZotFile (通过提示选择文件位置无意义)。
在 Zutilo 的首选项中，链接/页面附加函数可以通过提示文件位置仅当项目已经有其他附件时设置。
此首选项与 ZotFile 的“仅当项目有其他附件时询问”选项兼容，允许 ZotFile 移动/重命名第一个附件然后询问后面的名称/位置。

有些时候，保存一组项目的首选项以便以后使用是很有用的，但是通常不需要查看文档本身。
这种情况下，最好保存 Zotero 中的项目而不附件关联的文档文件。
使用这些函数省去了手动更改 Zotero 的“附加关联的 PDF 和其他文件”首选项或者手动删除不需要的文档的麻烦。
.

### 局限 ###

目前，Zutilo 作为 Firefox 浏览器面板或者独立标签与 Zotero 。
(以前，某些功能不在独立标签和独立版 Zotero 上工作)。
如果在某个模式下工作不正常，请尝试使用 Zotero 作为 Firefox 中的浏览器面板然后观察它是否正常工作。
然后请联系我通过 [Zutilo 的 Mozilla 附加组件页](https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/ "Mozilla Add-ons page")或者 [GitHub 页面](https://github.com/willsALMANJ/Zutilo "GitHub page"))。
某些浏览器特定的功能在 Zotero 独立版上不可用。

警告：我(其他一些人也有类似情况)已经使用 Zutilo 与我的 Zotero 收集一段时间正常工作。
如果我知道了任何问题，我会尽快修复它们。
在首次使用时，请备份你的数据或者在使用前先对一小部分项目测试 Zutilo 的功能以确保它们按照你希望的方式工作。

怎样安装
--------

### 1.

为 Zotero 安装 Zutilo 作为 Firefox 扩展的方式是通过 [Zutilo 的 Mozilla 附加组件页](https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/ "Zutilo's Mozilla Add-ons page")。
只需要在 Firefox 中打开此页然后点击“添加到 Firefox”按钮即可。
对于 Zotero 独立版，你需要下载 .xpi 文件并手动安装它(见下方)。

要获得 .xpi 文件，请打开 [Zutilo 的 Mozilla 附加组件页](https://addons.mozilla.org/en-US/firefox/addon/zutilo-utility-for-zotero/ "Zutilo's Mozilla Add-ons page")。
如果你正在使用 Firefox，请不要点击“添加到 Firefox”按钮，右键点击按钮并选择“链接另存为...”。
你会打开一个对话提示你保存 .xpi 文件。
如果你使用的是 Firefox 以外的浏览器，“添加到 Firefox”按钮会变成“现在下载”按钮。直接点击即可下载 .xpi 文件。

下载 zutilo.xpi 文件后，在 Firefox 或者 Zotero 独立版中打开工具-\>附加组件。
点击附加组件管理器窗口右上方区域的齿轮按钮并选择“从文件安装附加组件”。
然后选择 .xpi 文件安装。

### 2.

####

如果你访问 Mozilla 附加组件页有问题，你可以从 [Zutilo 的 GitHub 页面的下载部分](https://github.com/willsALMANJ/Zutilo/downloads "Zutilo's GitHub page") 下载 Zutilo。

点击“作为 zip 下载”按钮。
然后解压下载的文件，并重新打包，将文件的扩展名从“zip”更改为“xpi”(我不知道为什么 GitHub 的 zip 文件不能直接使用，但是解压并重新打包应该有效)。
.
.
.
.
. 
.

####

如果你获取 .xpi 正常工作 Firefox 有问题，你可以尝试下面的方法。

保存所有解压的 Zutilo 文件到你想要保存的计算机的某个地方。
创建一个名为 zutilo@www.wesailatdawn.com 的文本文件，将 Zutilo 的 chrome 文件夹的路径作为它的唯一一行文本写入，然后保存文件到你的 Firefox 配置文件夹下的 extensions 文件夹(只要你能找到扩展文件夹，此方法也对 Zotero 独立版有效)。
此方法在你想要使用 git 来保存 Zutilo 的所有更新从 GitHub 时有用(不过如果你使用 Zutilo 在 Firefox 中并从 Mozilla 附加组件页上安装它，Firefox 会自动更新 Zutilo 只要更新被 Mozilla通过)(比 GitHub 上发布略慢)。
.

.
.

功能请求和 Bug 提交
-------------------

最新的 Zutilo 源代码在 [GitHub](https://github.com/willsALMANJ/Zutilo "Zutilo's GitHub page") 上维护。
可以通过点击 GitHub 的 [Issues 部分](https://github.com/willsALMANJ/Zutilo/issues "GitHub Issues page") 的“New Issue”按钮来报告 Bug。
你也可以在那里查找你的 Bug 是否已经被其他用户报告过。
请确认检查 Issue 部分的“已关闭”标签来检查此 bug 是否已被报告。

也可以通过开启新 issue 来提交功能请求。
请在提交你的代码前开启一个新 issue。
关于鼓励发布的功能类型可以在 Zutilo [Zutilo wiki 页面](https://github.com/willsALMANJ/Zutilo/wiki)上查看。
计划的功能的 roadmap 也可以在 wiki上看到。

Zutilo 目前已被上传到 [BabelZilla](www.babelzilla.org) 的网络翻译系统。
英文以外的其他语言完成后，会被添加到 Zutilo。
.
.

Zutilo 重要更新日志
-------------------

本部分不是 Zutilo 的完整更新日志。
它包含 Zutilo 的所有重大更新或者添加功能。
如果在某个升级的 Zutilo 中某个功能失效，请查看此部分的解释。

* In version 1.2.11:

	1. New shortcuts/menu items:
		- Copy Zotero select link
		- Copy Zotero URI
	2. New shortcuts:
		- Focus collections, items pane, and various item pane tabs
		- Attachments: recognize PDF, create parent item, and rename from parent

* 

    1.
    2.
    3.

*

* 在 1.2.3 版本中，添加了附加 Firefox 中的页面和链接到当前选中的 Zotero 项目和保存当前页面到 Zotero 带附件如果默认设置是不带附件(或者不带附件如果默认设置是带附件)。

* 版本 1.2.1，Zutilo 可以被安装和卸载而不需重启 Firefox。

* 版本 1.1.17，modifyAttachments 更改为总是在重启 Firefox 后保留。

* 版本 1.1.16，modifyAttachments 现在可以替换路径中的任何部分而不只是开头。

* 版本 1.1.15，modifyAttachments 可以正常为 Windows 路径工作。

* 版本 1.1.11，Zutilo 创建来添加功能到 Zotero 的主 JavaScript 对象从“Zotero.Zutilo”更名为“ZutiloChrome.zoteroOverlay”。
调用此对象的方法的所有键盘快捷键需要被重命名以保持正常工作。

Credits
-------

Zutilo 基于和模仿了 [XUL School tutorial](https://developer.mozilla.org/en-US/docs/XUL_School) 中介绍的 Firefox 扩展结构。
另 y elige la opción "Instalar Add-on desde archivo".例子来自于 [Mozilla Developer Network](https://developer.mozilla.org/) 文档和 Zotero 的源代码。
.
.