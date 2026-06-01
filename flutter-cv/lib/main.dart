import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:visibility_detector/visibility_detector.dart';
import 'dart:math' as math;
import 'dart:ui';

void main() {
  runApp(const AndreaCariniApp());
}

class AndreaCariniApp extends StatelessWidget {
  const AndreaCariniApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Andrea Carini Portfolio',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0A0908),
        colorScheme: const ColorScheme.dark(
          primary: Color(0xFFC8A06E),
          secondary: Color(0xFFC8A06E),
          background: Color(0xFF0A0908),
        ),
        textTheme: GoogleFonts.dmSansTextTheme(ThemeData.dark().textTheme),
      ),
      home: const HomeScreen(),
    );
  }
}

// --- MODELS ---
class Project {
  final String name;
  final String description;
  final String imagePath;
  final List<String> tech;
  final String link;

  Project({
    required this.name,
    required this.description,
    required this.imagePath,
    required this.tech,
    required this.link,
  });
}

final List<Project> projects = [
  Project(
    name: 'Punto Cialde',
    description: 'Sito e-commerce e gestione completa del business digitale.',
    imagePath: 'assets/punotcialde .png',
    tech: ['WooCommerce', 'WordPress', 'SEO', 'Marketing'],
    link: 'https://www.puntocialde.com',
  ),
  Project(
    name: 'Il Ghiaccio Gourmet',
    description: 'Brand identity e design creativo per ghiaccio di alta qualità.',
    imagePath: 'assets/ghiaccio goruemt.jpg',
    tech: ['Brand Design', 'Illustrator', 'Marketing'],
    link: 'https://www.facebook.com/Ilghiacciogourmet/',
  ),
  Project(
    name: 'Ingrozone',
    description: 'Piattaforma e-commerce B2B e B2C per vendita all\'ingrosso.',
    imagePath: 'assets/ingorzone.jpg',
    tech: ['WooCommerce', 'WordPress', 'Logistics'],
    link: '#',
  ),
];

// --- HOME SCREEN ---
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with SingleTickerProviderStateMixin {
  late AnimationController _wobbleController;
  double _rotationX = 0.0;
  double _rotationY = 0.0;

  @override
  void initState() {
    super.initState();
    _wobbleController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _wobbleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: SizedBox(
              height: MediaQuery.of(context).size.height,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  _build3DHero(),
                  Positioned(
                    bottom: 80,
                    child: Column(
                      children: [
                        Text(
                          'Andrea Carini',
                          style: GoogleFonts.instrumentSerif(
                            fontSize: 48,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Sviluppo Aziendale • E-Commerce • Brand Design',
                          style: TextStyle(
                            color: Color(0xFFC8A06E),
                            letterSpacing: 2,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SliverToBoxAdapter(child: ProjectsSection()),
          const SliverToBoxAdapter(child: SkillsSection()),
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }

  Widget _build3DHero() {
    return GestureDetector(
      onPanUpdate: (details) {
        setState(() {
          _rotationY += details.delta.dx * 0.01;
          _rotationX -= details.delta.dy * 0.01;
          // Clamp values
          _rotationX = _rotationX.clamp(-0.4, 0.4);
          _rotationY = _rotationY.clamp(-0.4, 0.4);
        });
      },
      onPanEnd: (_) {
        setState(() {
          _rotationX = lerpDouble(_rotationX, 0, 0.15)!;
          _rotationY = lerpDouble(_rotationY, 0, 0.15)!;
        });
      },
      child: AnimatedBuilder(
        animation: _wobbleController,
        builder: (context, child) {
          final wobble = math.sin(_wobbleController.value * 2 * math.pi) * 0.05;
          return Transform(
            transform: Matrix4.identity()
              ..setEntry(3, 2, 0.001)
              ..rotateX(_rotationX + wobble)
              ..rotateY(_rotationY),
            alignment: Alignment.center,
            child: child,
          );
        },
        child: Container(
          width: 280,
          height: 370,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFFC8A06E).withOpacity(0.3),
                blurRadius: 30,
                spreadRadius: 5,
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(20),
            child: Image.asset(
              'assets/foto andrea.png',
              fit: BoxFit.cover,
            ),
          ),
        ),
      ),
    );
  }
}

// --- PROJECTS SECTION ---
class ProjectsSection extends StatefulWidget {
  const ProjectsSection({super.key});

  @override
  State<ProjectsSection> createState() => _ProjectsSectionState();
}

class _ProjectsSectionState extends State<ProjectsSection> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  bool _isVisible = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return VisibilityDetector(
      key: const Key('projects-section'),
      onVisibilityChanged: (info) {
        if (info.visibleFraction > 0.1 && !_isVisible) {
          _isVisible = true;
          _controller.forward();
        }
      },
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Progetti Realizzati',
              style: GoogleFonts.instrumentSerif(fontSize: 32, color: Colors.white),
            ),
            const SizedBox(height: 24),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 1,
                mainAxisSpacing: 20,
                childAspectRatio: 1.5,
              ),
              itemCount: projects.length,
              itemBuilder: (context, index) {
                final animation = CurvedAnimation(
                  parent: _controller,
                  curve: Interval(index * 0.2, 1.0, curve: Curves.easeOut),
                );
                return SlideTransition(
                  position: animation.drive(Tween<Offset>(
                    begin: const Offset(0, 0.2),
                    end: Offset.zero,
                  )),
                  child: FadeTransition(
                    opacity: animation,
                    child: ProjectCard(project: projects[index]),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class ProjectCard extends StatelessWidget {
  final Project project;
  const ProjectCard({super.key, required this.project});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(builder: (_) => ProjectDetailScreen(project: project)),
      ),
      child: Hero(
        tag: project.name,
        child: Card(
          clipBehavior: Clip.antiAlias,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: Stack(
            children: [
              Positioned.fill(
                child: Image.asset(project.imagePath, fit: BoxFit.cover),
              ),
              Positioned.fill(
                child: Container(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Colors.transparent, Colors.black.withOpacity(0.8)],
                    ),
                  ),
                ),
              ),
              Positioned(
                bottom: 20,
                left: 20,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      project.name,
                      style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Scopri di più →',
                      style: TextStyle(color: const Color(0xFFC8A06E).withOpacity(0.8), fontSize: 14),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// --- PROJECT DETAIL SCREEN ---
class ProjectDetailScreen extends StatelessWidget {
  final Project project;
  const ProjectDetailScreen({super.key, required this.project});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 400,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              background: Hero(
                tag: project.name,
                child: ParallaxImage(imagePath: project.imagePath),
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.all(24),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                Text(
                  project.name,
                  style: GoogleFonts.instrumentSerif(fontSize: 36, color: Colors.white),
                ),
                const SizedBox(height: 16),
                Text(
                  project.description,
                  style: const TextStyle(fontSize: 18, color: Colors.white70),
                ),
                const SizedBox(height: 24),
                const Text('TECNOLOGIE', style: TextStyle(letterSpacing: 2, fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  children: project.tech.map((t) => Chip(
                    label: Text(t),
                    backgroundColor: const Color(0xFFC8A06E).withOpacity(0.1),
                    side: const BorderSide(color: Color(0xFFC8A06E)),
                  )).toList(),
                ),
                const SizedBox(height: 40),
                ElevatedButton(
                  onPressed: () {},
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFC8A06E),
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('VISITA IL SITO'),
                ),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

class ParallaxImage extends StatelessWidget {
  final String imagePath;
  const ParallaxImage({super.key, required this.imagePath});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return Image.asset(
          imagePath,
          fit: BoxFit.cover,
          alignment: Alignment(0, (Scrollable.of(context).position.pixels / 400).clamp(-1, 1)),
        );
      },
    );
  }
}

// --- SKILLS SECTION ---
class SkillsSection extends StatelessWidget {
  const SkillsSection({super.key});

  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> skills = [
      {'name': 'ERP (SAP, Teamsystem)', 'value': 0.9},
      {'name': 'Contabilità & Prima Nota', 'value': 0.85},
      {'name': 'E-Commerce (Shopify, Woo)', 'value': 0.8},
      {'name': 'Brand Design', 'value': 0.75},
      {'name': 'Web Marketing & SEO', 'value': 0.75},
    ];

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Competenze',
            style: GoogleFonts.instrumentSerif(fontSize: 32, color: Colors.white),
          ),
          const SizedBox(height: 24),
          ...skills.map((s) => SkillIndicator(name: s['name'], value: s['value'])),
        ],
      ),
    );
  }
}

class SkillIndicator extends StatefulWidget {
  final String name;
  final double value;
  const SkillIndicator({super.key, required this.name, required this.value});

  @override
  State<SkillIndicator> createState() => _SkillIndicatorState();
}

class _SkillIndicatorState extends State<SkillIndicator> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;
  bool _isVisible = false;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: const Duration(seconds: 1));
    _animation = Tween<double>(begin: 0, end: widget.value).animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOut,
    ));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return VisibilityDetector(
      key: Key(widget.name),
      onVisibilityChanged: (info) {
        if (info.visibleFraction > 0.5 && !_isVisible) {
          _isVisible = true;
          _controller.forward();
        }
      },
      child: Padding(
        padding: const EdgeInsets.only(bottom: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.name, style: const TextStyle(fontSize: 14, color: Colors.white70)),
            const SizedBox(height: 8),
            AnimatedBuilder(
              animation: _animation,
              builder: (context, child) {
                return LinearProgressIndicator(
                  value: _animation.value,
                  backgroundColor: Colors.white10,
                  valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFC8A06E)),
                  minHeight: 6,
                  borderRadius: BorderRadius.circular(10),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
